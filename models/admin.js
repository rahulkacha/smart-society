const mongoose = require("mongoose");
const Society = require("./society");

// mongoose.connect("mongodb://localhost:27017/smartSocietyDB");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true, min: 10, max: 10 }, // will be validated during the request
  email: { type: String, required: true }, // will be validated during the request
  password: { type: String, required: true },
  society: { type: mongoose.Types.ObjectId }, // link to the society collection
  societyCode: { type: String, required: true }, // link to society collection
  admin: { type: Boolean, default: true },
});

Admin = mongoose.model("Admin", adminSchema);

function deleteAdmin(societyId) {
  Admin.deleteMany({ society: societyId }, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
      console.log(obj);
    }
  });
}

module.exports = { Admin, deleteAdmin };
