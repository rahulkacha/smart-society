require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("../../models/user").User
const GoogleStrategy = require("passport-google-oauth20").Strategy

passport.use("user-google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://smart--society.herokuapp.com/auth/google",
    scope: ["email", "profile"]
},
    (accessToken, refreshToken, profile, cb) => {
        User.findOne({
            googleId: profile.id,
            email: profile.emails[0].value
        }, (err, user) => {
            if (err) {
                console.log(err)
            }
            else if (user) {
                cb(null, user)
            } else {
                User.findOneAndUpdate({
                    email: profile.emails[0].value
                },
                    { googleId: profile.id }, (err, user) => {
                        if (err) {
                            console.log(err)
                        } else {
                            cb(null, user)
                        }
                    })
            }

        })


    }))

passport.serializeUser((user, done) => {
    done(null, user.id); // user => user.id
});

passport.deserializeUser((userId, done) => {
    User.findById(userId, (err, user) => {
        if (user) {
            done(null, user);
        } else {
            done(err);
        }
    });
});
