const bcrypt = require("bcrypt");
const passport = require("passport");
const _ = require("lodash");
const LocalStrategy = require("passport-local").Strategy;
const { User, deleteUser } = require("../models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, username, password, cb) => {
      User.findOne({ email: _.toLower(username) }, (err, obj) => {
        if (err) {
          console.log(err);
        } else {
          if (obj) {
            // USER EXISTS IN THE DATABASE
            bcrypt.compare(password, obj.password, (err, result) => {
              if (!result) {
                // WRONG PASSWORD
                console.log("wrong password! try again.");
                return cb(null, false, {
                  message: "wrong password! try again.",
                });
              } else {
                // PASSWORD IS CORRECT
                return cb(null, obj, {
                  message: "welcome!",
                });
              }
            });
          } else {
            // USER DOES NOT EXIST IN THE DATABASE SO REDIRECT HIM TO REGISTER PAGE
            return cb(null, false, {
              message: "Incorrect username or password.",
            });
          }
        }
      });
    }
  )
);
///////////////////////////////////////////////
// pass properties you want to use
passport.serializeUser((user, done) => {
  done(null, user); // user => user.id
});
///////////////////////////////////////////////

passport.deserializeUser((userId, done) => {
  User.findById(userId, (err, user) => {
    if (user) {
      done(null, user);
    } else {
      done(err);
    }
  });
});
