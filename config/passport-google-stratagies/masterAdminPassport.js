require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("passport");
const MasterAdmin = require("../../models/master-admin")
const GoogleStrategy = require("passport-google-oauth20").Strategy

passport.use("masterAdmin-google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://ec2-43-205-203-139.ap-south-1.compute.amazonaws.com/master/admin/auth/google",
    scope: ["email", "profile"]
},
    (accessToken, refreshToken, profile, cb) => {
        MasterAdmin.findOne({
            googleId: profile.id,
            email: profile.emails[0].value
        }, (err, user) => {
            if (err) {
                console.log(err)
            }
            else if (user) {
                cb(null, user)
            } else {
                MasterAdmin.findOneAndUpdate({
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
    MasterAdmin.findById(userId, (err, user) => {
        if (user) {
            done(null, user);
        } else {
            done(err);
        }
    });
});
