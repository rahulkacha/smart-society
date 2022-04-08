const mongoose = require("mongoose");
const Society = require("./society");

// mongoose.connect("mongodb://localhost:27017/smartSocietyDB");

const masterAdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }, // will be validated during the request
  password: { type: String, required: true },
});

const MasterAdmin = mongoose.model("MasterAdmin", masterAdminSchema);

const masterAdmin = new MasterAdmin({
  name: "rahul kacha",
  email: "rahulbkacha@gmail.com",
  password: "password",
});

// masterAdmin.save((err, obj) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(obj);
//   }
// });

module.exports = MasterAdmin;
