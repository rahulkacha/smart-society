const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const masterAdminRoutes = require("./routes/masterAdminRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// HOME PAGE
app.get("/", function (req, res) {
  res.render("test-pages/home");
});

// MASTER ADMIN ROUTES
app.use(masterAdminRoutes);

// ADMIN ROUTES
app.use(adminRoutes);

// USER ROUTES
app.use(userRoutes);



app.listen(5000, function () {
  console.log("Server started on port 5000.");
});
