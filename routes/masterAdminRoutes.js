const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const _ = require("lodash");
//
const MasterAdmin = require("../models/master-admin");
const { Society, deleteSociety } = require("../models/society");
const { Admin, deleteAdmin } = require("../models/admin");
const { Amenity, deleteAmenity } = require("../models/amenity");
const { Circular, deleteCircular } = require("../models/circular");
const { Complaint, deleteComplaint } = require("../models/complaint");
const { Meeting, deleteMeeting } = require("../models/meeting");
const { User, deleteUser } = require("../models/user");
const { State, City } = require("../models/states");

const DB_URL =
  "mongodb://localhost:27017/smartSocietyDB" ||
  "mongodb+srv://admin-rahul:" +
  process.env.MONGODB_PASSWORD +
  "@cluster0.ufyt2.mongodb.net/smartSocietyDB?retryWrites=true&w=majority";

mongoose.connect(DB_URL);

// LOGIN
router
  .route("/login")

  .get(function (req, res) {
    res.render("master-admin-pages/master-admin-login");
  })

  .post(function (req, res) {
    MasterAdmin.findOne({ email: _.toLower(req.body.email) }, (err, obj) => {
      if (obj) {
        bcrypt.compare(req.body.password, obj.password, (err, result) => {
          if (!result) {
            // WRONG PASSWORD
            console.log("wrong password!");
            res.redirect("/master/admin/login");
          } else {
            // RIGHT PASSWORD
            res.redirect("/master/admin/manage-societies");
          }
        });
      } else {
        //USER NOT FOUND
        console.log("user not found.");
      }
    });
  });

// GOOGLE OAUTH
router
  .route("/auth/google")

  .get(function (req, res) {
    res.send("master admin google auth triggered.");
  });

// ADD A SOCIETY
router
  .route("/add-society")

  .get(function (req, res) {
    State.findOne({}, (err, states) => {
      City.findOne({}, (err, cities) => {
        const city = cities.city.sort();
        const state = states.state.sort();
        res.render("master-admin-pages/master-add-society", {
          state: state,
          city: city,
        });
      });
    });
  })

  .post(function (req, res) {
    const id = mongoose.Types.ObjectId();
    const name = req.body.name;
    const newSociety = new Society({
      _id: id,
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      societyCode:
        name.replace(/\s/g, "").substring(0, 4) + // removes whitespace in b/w the string
        id.toString().substring(0, 3) +
        id.toString().substring(21, 24),
    });

    newSociety.save((err, obj) => {
      if (err) {
        console.log(err);
      } else {
        console.log(obj);
      }
    });
    res.redirect("/master/admin/manage-societies");
  });

// MANAGE SOCITIES
router
  .route("/manage-societies")

  .get(function (req, res) {
    Society.find({}, (err, result) => {
      res.render("master-admin-pages/master-manage-societies", {
        result: result,
      });
    });
  });



// MANAGE ADMINS
router.route("/manage-admins/:societyId")

  .get(function (req, res) {
    Admin.find({ society: req.params.societyId }, (err, admins) => {
      if (err) {
        console.log(err)
      } else {
        console.log(admins.length)
        Society.findById(req.params.societyId, (err, soc) => {
          res.render("master-admin-pages/master-manage-admins", { admins: admins, socName: soc.name })

        })
      }
    })
  });

// ACCEPT ADMIN REQUEST
router.route("/manage-admins/accept/:adminId")

  .get(function (req, res) {
    Admin.findOne({ _id: req.params.adminId }, (err, obj) => {
      obj.isAccepted = !obj.isAccepted
      obj.save((err, savedObj) => {
        if (err) {
          console.log(err)
        } else {
          res.redirect("/master/admin/manage-admins/" + savedObj.society)
        }
      })
    })
  });

// DELETE ADMIN
router.route("/delete-admin/:adminId")

  .get(function (req, res) {
    Admin.findByIdAndDelete(req.params.adminId, (err, obj) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/master/admin/manage-admins/" + obj.society);
      }
    });
  });

// DELETE ADMIN
router.route("/delete/:societyId/")

  .get(function (req, res) {
    const id = req.params.societyId;
    deleteSociety(id);
    deleteAdmin(id);
    deleteAmenity(id);
    deleteCircular(id);
    deleteComplaint(id);
    deleteMeeting(id);
    deleteUser(id);
    res.redirect("/master/admin/manage-societies");
  });

module.exports = router;
