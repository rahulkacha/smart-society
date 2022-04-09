const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const moment = require("moment");
//
const { Society, deleteSociety } = require("../models/society");
const { Admin, deleteAdmin } = require("../models/admin");
const { User, deleteUser } = require("../models/user");
const { Meeting, deleteMeeting } = require("../models/meeting");
const { Circular, deleteCircular } = require("../models/circular");

const saltRounds = 10;

// SETTING UP FILENAME AND DESTINATION
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // rejects a file based on the file type "mimetype"
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(
      null,
      console.error('worng file format! you uploaded "' + file.mimetype + '"'),
      false
    );
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, //5 megabyte
});

// ADMIN SIGNUP
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
                          { society: soc._id },
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
  .post(function (req, res) {
    Admin.findOne({ email: _.toLower(req.body.email) }, (err, obj) => {
      if (obj) {
        bcrypt.compare(req.body.password, obj.password, (err, result) => {
          if (!result) {
            // WRONG PASSWORD
            console.log("wrong password! try again.");
            res.redirect("/admin/login");
          } else {
            // RIGHT PASSWORD
            res.redirect("/admin/handle-users");
          }
        });
      } else {
        //USER NOT FOUND
        console.log("admin not found.");
        res.redirect("/admin/login");
      }
    });
  });

// GOOGLE OAUTH
router
  .route("/auth/google")

  .get(function (req, res) {
    res.send("admin google auth triggered.");
  });

// HANDLE USERS
router.route("/handle-users").get(function (req, res) {
  // FILTER USERS BY SOCIETY CODE FOUND FROM THE SESSION OF ADMIN
  User.find(
    {},
    {
      sort: {
        date: "asc",
      },
    },
    (err, objects) => {
      if (err) {
        console.log(err);
      } else {
        const users = objects;
        res.render("admin-pages/admin-handle-users", { users: users });
      }
    }
  );
});

router.route("/delete/:userId").get(function (req, res) {
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

  .get(function (req, res) {
    // FILTER MEETINGS BY SOCIETY ID COLLECTED FROM THE ADMIN SESSION DATA
    Meeting.find({}, (err, meetings) => {
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
  .post(function (req, res) {
    // ADD A MEETING BY SOCIETY ID COLLECTED FROM THE ADMIN SESSION DATA
    Society.findOne({ _id: "62514f189dbdf6fc51f03a91" }, (err, obj) => {
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

router.route("/meetings/delete/:meetingId").get(function (req, res) {
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

  .get(function (req, res) {
    // FILTER CIRCULARS BY SOCIETY ID COLLECTED FROM THE ADMIN SESSION DATA
    Circular.find({}, (err, circulars) => {
      if (!err) {
        res.render("admin-pages/admin-circulars", { circulars: circulars });
      }
    });
  })
  .post(function (req, res) {
    Society.findOne({ id: "62514f189dbdf6fc51f03a91" }, (err, obj) => {
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

// AMENITIES
router
  .route("/amenities")

  .get(function (req, res) {
    res.render("admin-pages/admin-amenities");
  })
  .post(upload.single("image"), function (req, res) {
    console.log(req.body);
    res.redirect("/admin/amenities");
  });

// COMPLAINTS
router
  .route("/complaints")

  .get(function (req, res) {
    res.render("admin-pages/admin-complaints-list");
  });

// COMPLAINT PAGE
router
  .route("/complaints/complaintId")

  .get(function (req, res) {
    res.render("admin-pages/admin-complaint");
  })
  .post(function (req, res) {
    // this will handle psoting the comment to
    // the database and overwriting the defalut comment
    console.log(req.body);
    res.redirect("/admin/complaints");
  });

module.exports = router;
