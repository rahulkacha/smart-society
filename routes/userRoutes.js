const express = require("express");
const validator = require("validator");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const moment = require("moment");
const router = express.Router();
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
                  newUser.save((err, obj) => {
                    if (err) {
                      console.log(err);
                    } else {
                      Society.findOne(
                        { societyCode: obj.societyCode },
                        (err, soc) => {
                          if (err) {
                            console.log(err);
                          } else {
                            User.findOneAndUpdate(
                              { _id: obj._id },
                              { society: soc._id },
                              (err, user) => {
                                if (err) {
                                  console.log(err);
                                } else {
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

  .get(function (req, res) {
    res.render("user-pages/user-login");
  })
  .post(function (req, res) {
    User.findOne({ email: _.toLower(req.body.email) }, (err, obj) => {
      if (err) {
        console.log(err);
      } else {
        if (obj) {
          // USER EXISTS IN THE DATABASE
          bcrypt.compare(req.body.password, obj.password, (err, result) => {
            if (!result) {
              // WRONG PASSWORD
              console.log("wrong password! try again.");
              res.redirect("/login");
            } else {
              // PASSWORD IS CORRECT
              res.redirect("/home");
            }
          });
        } else {
          // USER DOES NOT EXIST IN THE DATABASE SO REDIRECT HIM TO REGISTER PAGE
          res.redirect("/register");
        }
      }
    });
  });

// GOOGLE OAUTH
router
  .route("/auth/google")

  .get(function (req, res) {
    res.send("user google auth triggered.");
  });

// HOME PAGE
router
  .route("/home")

  .get(function (req, res) {
    res.render("user-pages/user-home");
  });

// SERVICES

// ALL AMENITIES
router
  .route("/services/amenities")

  .get(function (req, res) {
    Amenity.find({}, (err, amenities) => {
      if (err) {
        console.log(err);
      } else {
        // FILTER THE AMENITIES BY USER'S SESSION DATA
        User.findOne({ _id: "6256abfb4ee56d94de7acc8a" }, (err, obj) => {
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

  .get(function (req, res) {
    Amenity.findOne({ _id: req.params.amenityId }, (err, amenity) => {
      if (err) {
        console.log(err);
      } else {
        res.render("user-pages/user-book-amenity", { amenity: amenity });
      }
    });
  })

  .post(function (req, res) {
    // GET USER ID AND NAME FROM THE SESSION DATA
    Amenity.findOneAndUpdate(
      { _id: req.params.amenityId, canBeBooked: true },
      {
        $push: {
          bookings: {
            userId: "6256abfb4ee56d94de7acc8a", // userId from the session data
            name: "USER NAME FROM THE SESSION DATA",
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
            { _id: "6256abfb4ee56d94de7acc8a" },
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

  .get(function (req, res) {
    // FILTER CIRCULARRS BY SOCIETY USING SESSION DATA
    Circular.find({}, (err, circulars) => {
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
  .get(function (req, res) {
    // FILTER COMPLAINTS BY SOCIETY USING SESSION DATA
    Complaint.find({}, (err, complaints) => {
      if (err) {
        console.log(err);
      } else {
        res.render("user-pages/user-complaints", { complaints: complaints });
      }
    });
  })

  .post(function (req, res) {
    User.findOne({ _id: "6256abfb4ee56d94de7acc8a" }, (err, obj) => {
      if (err) {
        console.log(err);
      } else {
        console.log(obj.name);
        newComplaint = new Complaint({
          // LINK TO THE SOCITY FROM THE SESSION DATA
          title: req.body.title,
          description: req.body.description,
          filedOn: moment().format("DD/MM/YYYY"),
          filedBy: {
            user: {
              userId: "6256abfb4ee56d94de7acc8a",
              name: obj.name,
              block: obj.blockNo,
            },
          },
          society: "62514f189dbdf6fc51f03a91",
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
  .get(function (req, res) {
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

  .get(function (req, res) {
    Admin.find({}, (err, admins) => {
      if (err) {
        console.log(err);
      } else {
        res.render("user-pages/user-contact", {
          admins: admins,
          userName: "static user name",
          blockNo: "static block No",
        });
      }
    });
  });

module.exports = router;
