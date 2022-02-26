const express = require("express");
const router = express.Router();

// USER PAGES

// REGISTRATION
router
  .route("/register")

  .get(function (req, res) {
    res.render("user-pages/user-registration");
  })
  .post(function (req, res) {
    console.log(req.body);
    res.redirect("/home");
  });

// LOGIN
router
  .route("/login")

  .get(function (req, res) {
    res.render("user-pages/user-login");
  })
  .post(function (req, res) {
    console.log(req.body);
    res.redirect("/home");
  });

// HOME PAGE
router
  .route("/home")

  .get(function (req, res) {
    res.render("user-pages/user-home");
  });

// PROFILE
router
  .route("/profile")

  .get(function (req, res) {
    res.render("user-pages/user-profile");
  });

// SERVICES
router
  .route("/services")

  .get(function (req, res) {
    res.render("user-pages/user-services");
  });

// SERVICES/AMENITIES
router
  .route("/services/amenities")

  .get(function (req, res) {
    res.render("user-pages/user-amenities");
  })

  .post(function (req, res) {
    console.log(req.body);
    res.redirect("/services/amenities");
  });

// SERVICES/CIRCULARS
router
  .route("/services/circulars")

  .get(function (req, res) {
    res.render("user-pages/user-circulars");
  });

// SERVICES/COMPLAINTS
router
  .route("/services/complaints")

  .get(function (req, res) {
    res.render("user-pages/user-complaints");
  })

  .post(function (req, res) {
    console.log(req.body);
    res.redirect("/services/complaints");
  });

// CONTACT ADMIN/SECRETARY
router
  .route("/contact")

  .get(function (req, res) {
    res.render("user-pages/user-contact");
  });

module.exports = router;
