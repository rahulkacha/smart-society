require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("passport");
const Admin = require("../../models/admin").Admin
const GoogleStrategy = require("passport-google-oauth20").Strategy

passport.use("admin-google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://ec2-43-205-203-139.ap-south-1.compute.amazonaws.com/admin/auth/google",
    scope: ["email", "profile"]
},
    (accessToken, refreshToken, profile, cb) => {
        Admin.findOne({
            googleId: profile.id,
            email: profile.emails[0].value
        }, (err, user) => {
            if (err) {
                console.log(err)
            }
            else if (user) {
                cb(null, user)
            } else {
                Admin.findOneAndUpdate({
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
    Admin.findById(userId, (err, user) => {
        if (user) {
            done(null, user);
        } else {
            done(err);
        }
    });
});
