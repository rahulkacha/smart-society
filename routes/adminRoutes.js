const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const moment = require("moment");
const fs = require("fs");
const validator = require("validator");
//
const { Society, deleteSociety } = require("../models/society");
const { Admin, deleteAdmin } = require("../models/admin");
const { User, deleteUser } = require("../models/user");
const { Meeting, deleteMeeting } = require("../models/meeting");
const { Circular, deleteCircular } = require("../models/circular");
const { Amenity, deleteAmenity } = require("../models/amenity");
const { Complaint, deleteComplaint } = require("../models/complaint");
//
const passport = require("passport");
const { isAuth, isAdmin } = require("../config/authMiddleware");
//
const saltRounds = 10;
//
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: fileStorageEngine,
  limits: { fileSize: 1024 * 1024 * 5 }, //5 MB
  fileFilter: fileFilter,
});

// ADMIN SIGNUP / REGISTER
router
  .route("/signup")

  .get(function (req, res) {
    res.render("admin-pages/admin-signup");
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
            // IF SOCIETY EXISTS (FINDING BY THE SOCIETYCODE WHICH ADMIN HAS INPUTTED)
            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
              if (!err) {
                const newAdmin = new Admin({
                  name: req.body.name,
                  email: _.toLower(req.body.email),
                  password: hash,
                  contact: req.body.number,
                  societyCode: req.body.societyCode,
                });
                newAdmin.save((err, obj) => {
                  if (err) {
                    console.log(err);
                  } else {
                    Society.findOne(
                      { societyCode: obj.societyCode },
                      (err, soc) => {
                        if (err) {
                          console.log(err);
                        } else {
                          Admin.findOneAndUpdate(
                            { _id: obj._id },
                            {
                              society: soc._id,
                              societyName: soc.name
                            },
                            (err, admin) => {
                              if (err) {
                                console.log(err);
                              } else {
                                console.log(
                                  "successfully added " + admin.name + "."
                                );
                                res.redirect("/admin/login");
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
            console.log("email is invalid.");
            res.redirect("/admin/signup");
          }
        } else {
          // SOCIETY DOESN'T EXIST OR A TYPO IN SOCIETY CODE
          console.log("wrong society code. try again.");
          res.redirect("/admin/signup");
        }
      }
    });
  });

// ADMIN LOGIN
router
  .route("/login")

  .get(function (req, res) {
    res.render("admin-pages/admin-login");
  })
  .post(
    passport.authenticate("admin-local", {
      failureRedirect: "/admin/login",
      successRedirect: "/admin/handle-users",
    })
  );

// GOOGLE OAUTH
router
  .route("/login/google")

  .get(passport.authenticate("admin-google", { scope: ["email", "profile"] }))

// GOOGLE CALLBACK

router
  .route("/auth/google")
  .get(passport.authenticate("admin-google", { failureRedirect: "/admin/login" }), (req, res) => {
    res.redirect("/admin/handle-users")
  })

// LOGOUT
router
  .route("/logout")

  .get(isAuth, isAdmin, function (req, res) {
    req.logOut();
    res.redirect("/");
  });

// HANDLE USERS
router.route("/handle-users")

  .get(isAuth, isAdmin, function (req, res) {
    const adminSessionData = req.session.passport.user
    // FILTER USERS BY SOCIETY CODE FOUND FROM THE SESSION OF ADMIN
    User.find({ society: adminSessionData.society }, (err, users) => {
      if (err) {
        console.log(err);
      } else {
        console.log(adminSessionData)
        res.render("admin-pages/admin-handle-users", { users: users });
      }
    });
  });

router.route("/delete/:userId")

  .get(isAuth, isAdmin, function (req, res) {
    User.findByIdAndDelete(req.params.userId, (err, obj) => {
      if (err) {
        console.log(err);
      } else {
        console.log(obj);
        res.redirect("/admin/handle-users");
      }
    });
  });

// MEETINGS
router
  .route("/meetings")

  .get(isAuth, isAdmin, function (req, res) {
    const adminSessionData = req.session.passport.user
    Meeting.find({ society: adminSessionData.society }, (err, meetings) => {
      if (err) {
        console.log(err);
      } else {
        res.render("admin-pages/admin-meetings", {
          meetings: meetings,
          moment: moment,
        });
      }
    });
  })
  .post(isAuth, isAdmin, function (req, res) {
    const adminSessionData = req.session.passport.user
    Society.findOne({ _id: adminSessionData.society }, (err, obj) => {
      if (err) {
        console.log(err);
      } else {
        const meeting = new Meeting({
          title: req.body.title,
          agenda: req.body.agenda,
          date: req.body.dateTime,
          time: req.body.dateTime,
          society: obj._id, // add society ID from the user session
          details: req.body.details,
          venue: req.body.venue,
        });

        meeting.save((err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("successfully added a new meeting.");
          }
        });
        console.log(req.body);
        res.redirect("/admin/meetings");
      }
    });
  });

router.route("/meetings/delete/:meetingId")

  .get(isAuth, isAdmin, function (req, res) {
    Meeting.findByIdAndDelete(req.params.meetingId, (err, obj) => {
      if (err) {
        console.log(err);
      } else {
        console.log(obj);
        res.redirect("/admin/meetings");
      }
    });
  });

// CIRCULARS
router
  .route("/circulars")

  .get(isAuth, isAdmin, function (req, res) {
    const adminSessionData = req.session.passport.user
    Circular.find({ society: adminSessionData.society }, (err, circulars) => {
      if (err) {
        console.log(err)
      } else {
        res.render("admin-pages/admin-circulars", { circulars: circulars });
      }
    });
  })
  .post(isAuth, isAdmin, function (req, res) {
    const adminSessionData = req.session.passport.user
    Society.findOne({ _id: adminSessionData.society }, (err, obj) => {
      if (err) {
        console.log(err);
      } else {
        const newCircular = new Circular({
          title: req.body.title,
          details: req.body.details,
          date: moment().format("DD/MM/YYYY"),
          society: obj._id,
        });
        newCircular.save((err, obj) => {
          if (err) {
            console.log(err);
          } else {
            console.log(obj);
            res.redirect("/admin/circulars");
          }
        });
      }
    });
  });

router.route("/circulars/delete/:circularId")

  .get(isAuth, isAdmin, function (req, res) {
    Circular.findByIdAndDelete(req.params.circularId, (err, obj) => {
      if (err) {
        console.log(err);
      } else {
        console.log(obj);
        res.redirect("/admin/circulars");
      }
    });
  });

// AMENITIES
router
  .route("/amenities")

  .get(isAuth, isAdmin, function (req, res) {
    const adminSessionData = req.session.passport.user
    Amenity.find({ society: adminSessionData.society }, (err, amenities) => {
      if (err) {
        console.log(err);
      } else {
        res.render("admin-pages/admin-amenities", { amenities: amenities });
      }
    });
  })

  .post(isAuth, isAdmin, upload.single("image"), function (req, res) {
    const adminSessionData = req.session.passport.user
    // ADD AMENITIES BY SOCIETY ID COLLECTED FROM THE ADMIN SESSION DATA
    const newAmenity = new Amenity({
      name: req.body.name,
      description: req.body.description,
      society: adminSessionData.society,
      photo: req.file.path,
      canBeBooked: req.body.canBeBooked,
    });

    newAmenity.save((err, obj) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/admin/amenities");
      }
    });
  });

router.route("/amenities/delete/:amenityId")

  .get(isAuth, isAdmin, function (req, res) {
    Amenity.findByIdAndDelete(req.params.amenityId, (err, obj) => {
      if (err) {
        console.log(err);
      } else {
        User.updateMany(
          {},
          {
            $pull: {
              bookings: { amenityId: req.params.amenityId },
            },
          },
          (err, obj) => {
            if (err) {
              console.log(err);
            } else {
              console.log(obj);
            }
          }
        );
        fs.unlink(obj.photo, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`succesfully deleted ${obj.photo}`);
            res.redirect("/admin/amenities");
          }
        });
      }
    });
  });

// COMPLAINTS
router
  .route("/complaints")

  .get(isAuth, isAdmin, function (req, res) {
    const adminSessionData = req.session.passport.user
    Complaint.find({ society: adminSessionData.society, status: "pending" }, (err, complaints) => {
      if (err) {
        console.log(err);
      } else {
        res.render("admin-pages/admin-complaints-list", {
          complaints: complaints,
        });
      }
    });
  });

// COMPLAINT PAGE OF ADMIN TO COMMENT
router
  .route("/complaints/:complaintId")

  .get(isAuth, isAdmin, function (req, res) {
    Complaint.findOne({ _id: req.params.complaintId }, (err, complaint) => {
      if (err) {
        console.log(err);
      } else {
        res.render("admin-pages/admin-complaint", {
          complaint: complaint,
        });
      }
    });
  })
  .post(isAuth, isAdmin, function (req, res) {
    Complaint.findOneAndUpdate(
      { _id: req.params.complaintId },
      { comment: req.body.comment },
      (err, obj) => {
        if (err) {
          console.log(err);
        } else {
          console.log("comment added succesfully.");
          res.redirect("/admin/complaints");
        }
      }
    );
  });

// ADMIN RESOLVES A COMMENT
router.route("/complaints/resolve/:complaintId")

  .get(isAuth, isAdmin, function (req, res) {
    Complaint.findOneAndUpdate(
      { _id: req.params.complaintId },
      { status: "resolved" },
      (err, obj) => {
        if (err) {
          console.log(err);
        } else {
          console.log("resolved complaint " + req.params.complaintId);
          res.redirect("/admin/complaints");
        }
      }
    );
  });

module.exports = router;
