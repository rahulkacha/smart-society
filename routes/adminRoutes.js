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
  .route("/admin/login")

  .get(function (req, res) {
    res.render("admin-pages/admin-login");
  })
  .post(function (req, res) {
    console.log(req.body);
    res.redirect("/admin/profile");
  });

// GOOGLE OAUTH
router
  .route("/admin/auth/google")

  .get(function (req, res) {
    res.send("admin google auth triggered.");
  });

// ADMIN PROFILE
router.get("/admin/profile", function (req, res) {
  res.render("admin-pages/admin-profile");
});

// HANDLE USERS
router.get("/admin/handle-users", function (req, res) {
  res.render("admin-pages/admin-handle-users");
});

// MEETINGS
router
  .route("/admin/meetings")

  .get(function (req, res) {
    res.render("admin-pages/admin-meetings");
  })
  .post(function (req, res) {
    res.redirect("/admin/meetings");
  });

// CIRCULARS
router
  .route("/admin/circulars")

  .get(function (req, res) {
    res.render("admin-pages/admin-circulars");
  })
  .post(function (req, res) {
    console.log(req.body);
    res.redirect("/admin/circulars");
  });

// AMENITIES
router
  .route("/admin/amenities")

  .get(function (req, res) {
    res.render("admin-pages/admin-amenities");
  })
  .post(upload.single("image"), function (req, res) {
    res.redirect("/admin/amenities");
  });

// COMPLAINTS
router
  .route("/admin/complaints")

  .get(function (req, res) {
    res.render("admin-pages/admin-complaints");
  });

// COMPLAINT PAGE
router
  .route("/admin/complaints/complaintId")

  .get(function (req, res) {
    res.render("admin-pages/complaint");
  })
  .post(function (req, res) {
    // this will handle psoting the comment to
    // the database and overwriting the defalut comment
    console.log(req.body);
    res.redirect("/admin/complaints");
  });

module.exports = router;
