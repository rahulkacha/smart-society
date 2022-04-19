require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const masterAdminRoutes = require("./routes/masterAdminRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();
//
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/smartSocietyDB",
    }),
    cookie: { maxAge: 1000 * 24 * 60 * 60 }, //milliseconds
  })
);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/uploads/", express.static("./uploads/"));

app.use(bodyParser.urlencoded({ extended: true }));

// HOME PAGE
app.get("/", function (req, res) {
  res.render("test-pages/home");
});

// MASTER ADMIN ROUTES
app.use("/master/admin", masterAdminRoutes);

// ADMIN ROUTES
app.use("/admin", adminRoutes);

// USER ROUTES
app.use(userRoutes);

app.listen(process.env.PORT || 5000, function () {
  console.log("Server started on port 5000.");
});
