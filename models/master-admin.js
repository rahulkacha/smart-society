const mongoose = require("mongoose");
const Society = require("./society");

// mongoose.connect("mongodb://localhost:27017/smartSocietyDB");

const masterAdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }, // will be validated during the request
  password: { type: String, required: true },
  master: { type: Boolean, default: true },
});

const MasterAdmin = mongoose.model("MasterAdmin", masterAdminSchema);

module.exports = MasterAdmin;
