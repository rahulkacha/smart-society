const bcrypt = require("bcrypt");
const passport = require("passport");
const _ = require("lodash");
const LocalStrategy = require("passport-local").Strategy;
const { Admin, deleteAdmin } = require("../../models/admin");

passport.use("admin-local",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        (req, username, password, cb) => {
            Admin.findOne({ email: _.toLower(username) }, (err, obj) => {
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
// pass properties you want to use
passport.serializeUser((admin, done) => {
    done(null, admin); // user => user.id
});

passport.deserializeUser((adminId, done) => {
    Admin.findById(adminId, (err, admin) => {
        if (admin) {
            done(null, admin);
        } else {
            done(err);
        }
    });
});
