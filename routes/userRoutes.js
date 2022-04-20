const express = require("express");
const validator = require("validator");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const moment = require("moment");
const router = express.Router();
//
const passport = require("passport");
const { isAuth, isNotAuth } = require("../config/authMiddleware");
//
const { Society, deleteSociety } = require("../models/society");
const { User, deleteUser } = require("../models/user");
const { Amenity, deleteAmenity } = require("../models/amenity");
const { Circular, deleteCircular } = require("../models/circular");
const { Complaint, deleteComplaint } = require("../models/complaint");
const { Admin, deleteAdmin } = require("../models/admin");

const saltRounds = 10;
// USER PAGES

// REGISTRATION
router
  .route("/register")

  .get(function (req, res) {
    res.render("user-pages/user-registration");
  })
  .post(function (req, res) {
    let societyExist = false;
    let socCodes = [];
    Society.find({}, (err, objects) => {
      if (!err) {
        objects.forEach((element) => {
          socCodes.push(element.societyCode);
        });
        societyExist = socCodes.includes(req.body.societyCode);

        if (societyExist) {
          if (validator.isEmail(req.body.email)) {
            if (req.body.password == req.body.password2) {
              // IF SOCIETY EXISTS (FINDING BY THE SOCIETYCODE WHICH ADMIN HAS INPUTTED)
              bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                if (!err) {
                  const newUser = new User({
                    name: req.body.fName.trim() + " " + req.body.lName.trim(),
                    email: _.toLower(req.body.email),
                    password: hash,
                    blockNo: req.body.blockNo,
                    contact: req.body.number,
                    occupantType: req.body.occupantType,
                    societyCode: req.body.societyCode,
                    date: moment().format("DD/MM/YYYY"),
                  });
                  newUser.save((err, user) => {
                    if (err) {
                      console.log(err);
                    } else {
                      Society.findOne(
                        { societyCode: user.societyCode },
                        (err, soc) => {
                          if (err) {
                            console.log(err);
                          } else {
                            //  adding society id to the user object
                            User.findOneAndUpdate(
                              { _id: user._id },
                              { society: soc._id },
                              (err, user) => {
                                if (err) {
                                  console.log(err);
                                } else {
                                  // pushing new user's id into the society's users array
                                  Society.findOneAndUpdate(
                                    { societyCode: user.societyCode },
                                    { $push: { users: user._id } },
                                    (err, obj) => {
                                      console.log(obj);
                                    }
                                  );
                                  console.log(
                                    "successfully added " + user.name + "."
                                  );
                                  res.redirect("/login");
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  });
                }
              });
            } else {
              console.log("password does not match.");
              res.redirect("/register");
            }
          } else {
            console.log("email is invalid.");
            res.redirect("/register");
          }
        } else {
          // SOCIETY DOESN'T EXIST OR A TYPO IN SOCIETY CODE
          console.log("wrong society code. try again.");
          res.redirect("/register");
        }
      }
    });
  });

// LOGIN
router
  .route("/login")

  .get(isNotAuth, function (req, res) {
    res.render("user-pages/user-login");
  })
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      successRedirect: "/home",
    })
  );

// GOOGLE OAUTH
router
  .route("/auth/google")

  .get(function (req, res) {
    res.send("user google auth triggered.");
  });

// LOGOUT
router
  .route("/logout")

  .get(isAuth, function (req, res) {
    req.logOut();
    res.redirect("/");
  });

// HOME PAGE
router
  .route("/home")

  .get(isAuth, function (req, res) {
    res.render("user-pages/user-home");
  });

// SERVICES

// ALL AMENITIES
router
  .route("/services/amenities")

  .get(isAuth, function (req, res) {
    const userSessionData = req.session.passport.user
    Amenity.find({ _id: userSessionData.society }, (err, amenities) => {
      if (err) {
        console.log(err);
      } else {
        User.findOne({ _id: userSessionData._id }, (err, obj) => {
          if (err) {
            console.log(err);
          } else {
            if (obj) {
              res.render("user-pages/user-amenities-list", {
                amenities: amenities,
                bookings: obj.bookings,
              });
            }
          }
        });
      }
    });
  });

// BOOK AN AMENITY
router
  .route("/services/amenities/book/:amenityId")

  .get(isAuth, function (req, res) {
    const userSessionData = req.session.passport.user
    Amenity.findOne({ _id: req.params.amenityId }, (err, amenity) => {
      if (err) {
        console.log(err);
      } else {
        res.render("user-pages/user-book-amenity", { amenity: amenity });
      }
    });
  })

  .post(isAuth, function (req, res) {
    const userSessionData = req.session.passport.user
    Amenity.findOneAndUpdate(
      { _id: req.params.amenityId, canBeBooked: true },
      {
        $push: {
          bookings: {
            userId: userSessionData._id,
            name: userSessionData.name,
            bookFrom: {
              date: moment(req.body.bookFrom).format("DD/MM/YYYY"),
              time: moment(req.body.bookFrom).format("hh:mm A"),
            },
            bookTill: {
              date: moment(req.body.bookTill).format("DD/MM/YYYY"),
              time: moment(req.body.bookTill).format("hh:mm A"),
            },
          },
        },
      },
      (err, obj) => {
        if (err) {
          console.log(err);
        } else {
          User.findOneAndUpdate(
            { _id: userSessionData._id },
            {
              $push: {
                bookings: {
                  amenityName: obj.name,
                  amenityId: obj._id,
                  bookingId: obj.bookings.slice(-1)._id,
                  bookFrom: {
                    date: moment(req.body.bookFrom).format("DD/MM/YYYY"),
                    time: moment(req.body.bookFrom).format("hh:mm A"),
                  },
                  bookTill: {
                    date: moment(req.body.bookTill).format("DD/MM/YYYY"),
                    time: moment(req.body.bookTill).format("hh:mm A"),
                  },
                },
              },
            },
            (err, obj) => {
              if (err) {
                console.log(err);
              } else {
                res.redirect("/services/amenities");
              }
            }
          );
        }
      }
    );
  });

// CIRCULARS
router
  .route("/services/circulars")

  .get(isAuth, function (req, res) {
    const userSessionData = req.session.passport.user
    Circular.find({ society: userSessionData.society }, (err, circulars) => {
      if (err) {
        confirm.log(err);
      } else {
        res.render("user-pages/user-circulars", { circulars: circulars });
      }
    });
  });

// COMPLAINTS
router
  .route("/services/complaints")
  .get(isAuth, function (req, res) {
    const userSessionData = req.session.passport.user
    Complaint.find({
      society: userSessionData.society,
      "filedBy.user.userId": userSessionData._id
    }, (err, complaints) => {
      if (err) {
        console.log(err);
      } else {
        res.render("user-pages/user-complaints", { complaints: complaints });
      }
    });
  })

  .post(isAuth, function (req, res) {
    const userSessionData = req.session.passport.user
    User.findOne({ _id: userSessionData._id }, (err, obj) => {
      if (err) {
        console.log(err);
      } else {
        newComplaint = new Complaint({
          title: req.body.title,
          description: req.body.description,
          filedOn: moment().format("DD/MM/YYYY"),
          filedBy: {
            user: {
              userId: userSessionData._id,
              name: obj.name,
              block: obj.blockNo,
            },
          },
          society: userSessionData.society,
        });

        newComplaint.save((err, obj) => {
          if (err) {
            console.log(err);
          } else {
            console.log(obj);
            res.redirect("/services/complaints");
          }
        });
      }
    });
  });

router
  .route("/services/complaints/delete/:complaintId")
  .get(isAuth, function (req, res) {
    const userSessionData = req.session.passport.user
    Complaint.findByIdAndDelete(req.params.complaintId, (err, obj) => {
      if (err) {
        console.log(err);
      } else {
        console.log(obj);
        res.redirect("/services/complaints");
      }
    });
  });

// CONTACT ADMIN/SECRETARY
router
  .route("/contact")

  .get(isAuth, function (req, res) {
    const userSessionData = req.session.passport.user
    Admin.find({ society: userSessionData.society }, (err, admins) => {
      if (err) {
        console.log(err);
      } else {

        res.render("user-pages/user-contact", {
          admins: admins,
          userName: userSessionData.name,
          blockNo: userSessionData.blockNo,
        });
      }
    });
  });

module.exports = router;
