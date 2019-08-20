const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const app = express();

//load person model
const Person = require("../../models/Person");
//load profile model
const Profile = require("../../models/Profile");
//load Question model
const Question = require("../../models/Question");

// @type   GET
//@route    /api/questions/
//@desc     route for showing all questions
//@access   PUBLIC
router.get("/", (req, res) => {
  Question.find()
    .sort({ date: "desc" })
    .then(questions => res.json(questions))
    .catch(err => res.json({ NoQuestion: "No question found!" }));
});

// @type   POST
//@route    /api/questions/
//@desc     route for posting question
//@access   PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/auth.html"
  }), //after successful auth the req.user invoked,filled by the information of logger.
  (req, res) => {
    const newQuestion = new Question({
      tittle: req.body.tittle,
      question: req.body.question,
      code: req.body.code,
      askby: req.user.id
    });
    newQuestion
      .save()
      .then(question => res.json(question))
      .catch(err => console.log("unable to post question " + err));
  }
);

// @type   GET
//@route    /api/questions/ask/
//@desc     route for posting question
//@access   PRIVATE
router.get(
  "/ask",
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "http://localhost:3000/api/auth"
  }),
  (req, res) => {
    res.render("ask.ejs");
  }
);

// @type   POST
//@route    /api/questions/answers/:id(questionID)
//@desc     route for posting answers
//@access   PRIVATE
router.post(
  "/answers/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findById(req.params.id)
      .then(question => {
        const newAnswer = {
          answerby: req.user.id,
          answer: req.body.answer
        };
        question.answers.unshift(newAnswer);
        question
          .save()
          .then(question => res.json(question))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

// @type   POST
//@route    /api/questions/upvote/:id(answerID)
//@desc     route for upvoting
//@access   PRIVATE
router.post(
  "/upvote/:quesID/:ansID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Question.findById(req.params.quesID)
        .then(question => {
          answer = question.answers.filter(
            ans => ans.id.toString() === req.params.ansID
          );
          //res.json(answer);
          if (
            answer[0].upvotes.filter(
              //checking of each element & pushing into a array
              upvote => upvote.user.toString() === req.user.id.toString()
            ).length > 0
          ) {
            //if length>0=>already upvoted
            return res.status(400).json({ noupvote: "already upvoted" });
          }
          answer[0].upvotes.unshift({ user: req.user.id });
          question
            .save()
            .then(answer => res.json(question))
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    });
  }
);

// @type   GET
//@route    /api/questions/find/:id(questionID)
//@desc     route for finding question by ID
//@access   PUBLIC
router.get("/find/:id", (req, res) => {
  Question.findById(req.params.id)
    .then(question => {
      res.render("question.ejs", {
        questittle: question.tittle,
        question: question.question,
        quescode: question.code
      });
    })
    .catch(err => res.json({ NoQuestion: "No question found!" }));
});

module.exports = router;
