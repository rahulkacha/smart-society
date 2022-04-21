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
//
const passport = require("passport");
const { isAuth, isMasterAdmin } = require("../config/authMiddleware");
//

// LOGIN
router
  .route("/login")

  .get(function (req, res) {
    res.render("master-admin-pages/master-admin-login");
  })

  .post(
    passport.authenticate("masterAdmin-local", {
      failureRedirect: "/master/admin/login",
      successRedirect: "/master/admin/manage-societies",
    })
  )

// GOOGLE OAUTH
router
  .route("/login/google")

  .get(passport.authenticate("masterAdmin-google", { scope: ["email", "profile"] }))


// GOOGLE CALLBACK
router
  .route("/auth/google")

  .get(passport.authenticate("masterAdmin-google", { failureRedirect: "/master/admin/login" }), (req, res) => {
    res.redirect("/master/admin/manage-societies")
  })

// LOGOUT
router
  .route("/logout")

  .get(isAuth, isMasterAdmin, function (req, res) {
    req.logOut();
    res.redirect("/");
  });

// ADD A SOCIETY
router
  .route("/add-society")

  .get(isAuth, isMasterAdmin, function (req, res) {
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

  .post(isAuth, isMasterAdmin, function (req, res) {
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

  .get(isAuth, isMasterAdmin, function (req, res) {
    Society.find({}, (err, result) => {
      res.render("master-admin-pages/master-manage-societies", {
        result: result,
      });
    });
  });



// MANAGE ADMINS
router.route("/manage-admins/:societyId")

  .get(isAuth, isMasterAdmin, function (req, res) {
    Admin.find({ society: req.params.societyId }, (err, admins) => {
      if (err) {
        console.log(err)
      } else {
        Society.findById(req.params.societyId, (err, soc) => {
          res.render("master-admin-pages/master-manage-admins", { admins: admins, socName: soc.name })

        })
      }
    })
  });

// ACCEPT ADMIN REQUEST
router.route("/manage-admins/accept/:adminId")

  .get(isAuth, isMasterAdmin, function (req, res) {
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

  .get(isAuth, isMasterAdmin, function (req, res) {
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

  .get(isAuth, isMasterAdmin, function (req, res) {
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
