const express = require("express");
const router = express.Router();

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
