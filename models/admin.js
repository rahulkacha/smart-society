const mongoose = require("mongoose");
const Society = require("./society");

// mongoose.connect("mongodb://localhost:27017/smartSocietyDB");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true, min: 10, max: 10 }, // will be validated during the request
  email: { type: String, required: true }, // will be validated during the request
  password: { type: String, required: true },
  society: { type: mongoose.Types.ObjectId, required: true }, // link to the society collection
  societyCode: { type: String, required: true }, // link to society collection
});

Admin = mongoose.model("Admin", adminSchema);

/////////////////////////////////////////////////////////////////////////
// Society.find({ _id: "624ae7a023653564cc302c25" }, (err, obj) => {
//   // add society ID from the user session
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(obj);
//     admin = new Admin({
//       name: "req.body.name",
//       contact: "req.body.contact",
//       email: "req.body.email",
//       password: "req.body.password (encrypted ofc)",
//       society: obj[0].id,
//       societyCode: obj[0].societyCode,
//     });

// admin.save((err, obj) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("succesfully added a new admin.");
//   }
// });
//   }
// });

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
