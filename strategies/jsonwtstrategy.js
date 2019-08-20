const JwtStrategy = require("passport-jwt").Strategy;
const mongoose = require("mongoose");
const Person = mongoose.model("myPerson");
const myKey = require("../setup/myurl");

let cookieExtractor = function(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

let opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = myKey.secret;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      Person.findById(jwt_payload.id)
        .then(person => {
          if (person) {
            return done(null, person);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
