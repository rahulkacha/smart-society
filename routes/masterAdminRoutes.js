const express = require("express");
const router = express.Router();

// LOGIN

router
  .route("/master/admin/login")
  .get(function (req, res) {
    res.render("master-admin-pages/master-admin-login");
  })
  .post(function (req, res) {
    console.log(req.body);
    res.redirect("/master/admin/manage-societies");
  });

// GOOGLE OAUTH
router
  .route("/master/admin/auth/google")

  .get(function (req, res) {
    res.send("master admin google auth triggered.");
  });

// ADD A SOCIETY
router
  .route("/master/admin/add-society")

  .get(function (req, res) {
    res.render("master-admin-pages/master-add-society");
  })
  .post(function (req, res) {
    console.log(req.body);
    res.redirect("/master/admin/add-society");
  });

// MANAGE SOCITIES
router
  .route("/master/admin/manage-societies")

  .get(function (req, res) {
    res.render("master-admin-pages/master-manage-societies");
  })
  .post(function (req, res) {
    // deltetion of society from the database
  });

module.exports = router;
