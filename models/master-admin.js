const mongoose = require("mongoose");

const masterAdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }, // will be validated during the request
  password: { type: String, required: true },
  master: { type: Boolean, default: true },
  googleId: { type: String }
});

const MasterAdmin = mongoose.model("MasterAdmin", masterAdminSchema);

module.exports = MasterAdmin;
