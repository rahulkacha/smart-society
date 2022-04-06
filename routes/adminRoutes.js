const express = require("express");
const router = express.Router();
const multer = require("multer");

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

// ADMIN LOGIN
router
  .route("/login")

  .get(function (req, res) {
    res.render("admin-pages/admin-login");
  })
  .post(function (req, res) {
    console.log(req.body);
    res.redirect("/admin/handle-users");
  });

// GOOGLE OAUTH
router
  .route("/auth/google")

  .get(function (req, res) {
    res.send("admin google auth triggered.");
  });

// HANDLE USERS
router.route("/handle-users").get(function (req, res) {
  res.render("admin-pages/admin-handle-users");
});

// MEETINGS
router
  .route("/meetings")

  .get(function (req, res) {
    res.render("admin-pages/admin-meetings");
  })
  .post(function (req, res) {
    res.redirect("/admin/meetings");
  });

// CIRCULARS
router
  .route("/circulars")

  .get(function (req, res) {
    res.render("admin-pages/admin-circulars");
  })
  .post(function (req, res) {
    console.log(req.body);
    res.redirect("/admin/circulars");
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
