const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const passport = require("passport");
const path = require("path");
const methodoverride = require("method-override");
const cookieParser = require("cookie-parser");

//bring all routes
const auth = require("./routes/api/auth");
const questions = require("./routes/api/questions");
const profile = require("./routes/api/profile");

const app = express();

//templete engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//middleware for bodyparser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(methodoverride("_method"));

//middleware for cookieParser
app.use(cookieParser());

//mongoDB config
const db = require("./setup/myurl").mongoURL;

//Attempt to connect to database

mongoose
  .connect(db)
  .then(() => console.log("connected to database successfully..."))
  .catch(err => console.log(err));

//passport middlware
app.use(passport.initialize());

//config for jwt stregaty
require("./strategies/jsonwtstrategy")(passport);

//loding staticFile
app.use(express.static(__dirname + "/public"));

//routes
app.use("/api/auth", auth);
app.use("/api/questions", questions);
app.use("/api/profile", profile);

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log("server is running...");
});
