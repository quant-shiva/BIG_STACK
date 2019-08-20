const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../setup/myurl");

//login page route
router.get("/", (req, res) => res.render("auth.ejs"));

//importing person schema for registration
const Person = require("../../models/Person");

// @type    POST
//@route    /api/auth/register
//@desc     route for registration of users
//@access   PUBLIC
router.post("/register", (req, res) => {
  Person.findOne({ email: req.body.email })
    .then(person => {
      if (person) {
        return res
          .status(400)
          .json({ emailerror: "this email is already resister" });
      } else {
        Person.findOne({ username: req.body.username }).then(username => {
          if (username) {
            return res
              .status(400)
              .json({ usernameerror: "this username is already choosen" });
          } else {
            const newPerson = new Person({
              username: req.body.username,
              name: req.body.name,
              email: req.body.email,
              password: req.body.password
            });
            //Encrypting password using bcrypt
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newPerson.password, salt, (err, hash) => {
                if (err) throw err;
                newPerson.password = hash;
                newPerson
                  .save()
                  .then(person => res.render("auth.ejs"))
                  .catch(err => console.log(err));
              });
            });
          }
        });
      }
    })
    .catch(err => console.log(err));
});

// @type    POST
//@route    /api/auth/login
//@desc     route for login of users
//@access   PUBLIC
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  Person.findOne({ email })
    .then(person => {
      if (!person) {
        return res.status(404).json({ emailerror: "user not found" });
      }
      bcrypt.compare(password, person.password).then(isCorrect => {
        if (isCorrect) {
          // res.json({ success: "your login is successful" });
          // use payload and create token for user.
          const payload = {
            id: person.id,
            username: person.username,
            name: person.name,
            email: person.email
          };
          jsonwt.sign(
            payload,
            key.secret,
            { expiresIn: 60 * 60 },
            (err, token) => {
              if (err) throw err;
              res.cookie("jwt", token);
              res.json({
                username: person.username
              });
            }
          );
        } else {
          res //why not return use here.
            .status(400)
            .json({ passworderror: "your password is not correct!" });
        }
      });
    })
    .catch(err => console.log(err));
});

// @type    GET
//@route    /api/auth/logout
//@desc     route for user profile
//@access   PRIVATE
router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});

// @type    GET
//@route    /api/auth/profile
//@desc     route for user profile
//@access   PRIVATE
// router.get(
//   "/profile",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     res.json({
//       id: req.user.id,
//       name: req.user.name,
//       email: req.user.email,
//       profilepic: req.user.profilepic
//     });
//   }
// );

module.exports = router;
