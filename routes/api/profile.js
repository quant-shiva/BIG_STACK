const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const multer = require("multer");
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const path = require("path");
const methodoverride = require("method-override");

//load person model
const Person = require("../../models/Person");

//load profile model
const Profile = require("../../models/Profile");

// @type    GET
//@route    /api/profile
//@desc     route for personal user profile
//@access   PRIVATE
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          return res.render("editProfile.ejs");
        }
        res.render("user.ejs", { profile });
      })
      .catch(err => console.log("got some error in profile" + err));
  }
);

// @type    POST
//@route    /api/profile/
//@desc     route for updating and saving personal user profile
//@access   PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.body.country);
    const profileValues = {};
    profileValues.user = req.user.id;
    if (req.body.username) profileValues.username = req.body.username;
    if (req.body.website) profileValues.website = req.body.website;
    if (req.body.country) profileValues.country = req.body.country;
    if (req.body.portfolio) profileValues.portfolio = req.body.portfolio;
    if (req.body.languages) profileValues.languages = req.body.languages;
    //populate the social object
    profileValues.social = {};
    if (req.body.youtube) profileValues.social.youtube = req.body.youtube;
    if (req.body.facebook) profileValues.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileValues.social.linkedin = req.body.linkedin;
    if (req.body.github) profileValues.social.github = req.body.github;

    //Do database stuff here
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileValues },
            { new: true }
          )
            .then(profile => res.render("user.ejs"))
            .catch(err => console.log("problem in update" + err));
        } else {
          Profile.findOne({ username: profileValues.username })
            .then(profile => {
              //Username already exist
              if (profile) {
                res.status(400).json({ Username: "username already exists" });
              }
              //save user
              new Profile(profileValues)
                .save()
                .then(profile => res.json(profile))
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log("Problem in fetching profile" + err));
  }
);
// @type   POST
//@route    /api/profile/upload
//@desc     route for editting profile pic
//@access   PRIVITE
const uri = require("../../setup/myurl").mongoURL;
const conn = mongoose.createConnection(uri);

let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

//create storage engine
let filename;
const storage = new GridFsStorage({
  url: uri,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage }).single("profilepic");
// const storage = new GridFsStorage({
//   url: uri,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       const fileInfo = {
//         filename: "xxx",
//         bucketName: "uploads"
//       };
//       resolve(fileInfo);
//     });
//   }
// });
// const upload = multer({ storage }).single("profilepic");

router.post("/upload", upload, (req, res) => {
  let usr = "quant";
  const profilepicSet = {};
  profilepicSet.profilepic = filename;
  Profile.findOne({ username: usr }).then(profile => {
    if (profile) {
      Profile.findOneAndUpdate(
        { username: usr },
        { $set: profilepicSet },
        { new: true }
      )
        .then(
          res.sendFile(path.join(__dirname, "../../public", "profile.html"))
        )
        .catch(err => console.log("problem in update" + err));
    }
  });
});

// //@GET for all file(image object)
// router.get("/profilepic", (req, res) => {
//   gfs.files.find().toArray((err, files) => {
//     return res.json(files);
//   });
// });

// //@GET for one file(image object)
// router.get("/profilepic/:filename", (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     if (!file || file.length === 0) {
//       res.status(404).json({
//         err: "no file exits"
//       });
//     }
//     return res.json(file);
//   });
// });

//@GET for one file(image)
router.get("/profilepic/show/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      res.status(404).json({
        err: "no file exits"
      });
    }
    //read output to browser
    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  });
});

//@GET for one file(image)
router.get("/profilepic/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      res.status(404).json({
        err: "no file exits"
      });
    }
    res.render("profile.ejs", { file: file });
  });
});

// @type    GET
//@route    /api/profile/:username
//@desc     route for getting profile based on USERNAME
//@access   PUBLIC
router.get("/:username", (req, res) => {
  Profile.findOne({ username: req.params.username })
    .populate("user", ["name"])
    .then(profile => {
      if (!profile) {
        res.status(404).json({ usernotfound: "User not found" });
      }
      //res.json(profile);
      res.render("profile.ejs", { profile: profile });
    })
    .catch(err => console.log("ERROR IN FETCHING USERNAME " + err));
});

// @type    GET
//@route    /api/profile/userid/:userid
//@desc     route for getting profile based on USERID
//@access   PUBLIC
router.get("/userid/:userid", (req, res) => {
  Profile.findOne({ user: req.params.userid })
    //.populate("user", ["name", "profilepic"])
    .then(profile => {
      if (!profile) {
        res
          .status(404)
          .json({ usernotfound: "User not found based on userid" });
      }
      res.json(profile);
    })
    .catch(err => console.log("ERROR IN FETCHING USERNAME " + err));
});

// @type    GET
//@route    /api/profile/everyone
//@desc     route for getting all the profile
//@access   PUBLIC
router.get("/find/everyone", (req, res) => {
  Profile.find()
    .populate("user", ["name", "profilepic"])
    .then(profiles => {
      if (!profiles) {
        res.status(404).json({ usernotfound: "User not found" });
      }
      res.json(profiles);
    })
    .catch(err => console.log("ERROR IN FETCHING USERNAME " + err));
});

// @type    DELETE
//@route    /api/profile/
//@desc     route for deleting profile based on ID
//@access   PRIVATE
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id });
    Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {
        Person.findByIdAndRemove({ _id: req.user.id })
          .then(() => {
            success: "Account is successfully deleted.";
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log("ERROR IN DELETION " + err));
  }
);

module.exports = router;
