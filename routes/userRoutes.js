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
    // validate the email address in backend
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

// SERVICES/ALL AMENITIES
router
  .route("/services/amenities")

  .get(function (req, res) {
    res.render("user-pages/user-amenities-list");
  });

// SERVICES/BOOK AN AMENITY
router // the route will be /services/amenities/book/:amenityID
  .route("/services/amenities/book")

  .get(function (req, res) {
    res.render("user-pages/user-book-amenity");
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
