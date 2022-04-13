const mongoose = require("mongoose");
const Society = require("./society");
const moment = require("moment");

// mongoose.connect("mongodb://localhost:27017/smartSocietyDB");

const circularSchema = new mongoose.Schema({
  title: { type: String, required: true },
  details: { type: String, default: "-" },
  date: { type: String, required: true },
  society: { type: mongoose.Types.ObjectId, required: true }, // link to the society collection
});

const Circular = new mongoose.model("Circular", circularSchema);

// Society.find({ _id: "624ae7a023653564cc302c25" }, (err, obj) => {
//   if (err) {
//     console.log(err);
//   } else {
//     const soc_obj = obj[0];
//     const date = moment().format("DD/MM/YYYY");

//     const circular = new Circular({
//       title: "req.body.title",
//       date: moment().format("DD/MM/YYYY"), // parsed date
//       society: soc_obj._id, // add society ID from the user session
//       details: "req.body.details",
//     });

// circular.save((err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("successfully added a new meeting.");
//   }
// });
//   }
// });

function deleteCircular(societyId) {
  Circular.deleteMany({ society: societyId }, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
      console.log(obj);
    }
  });
}

module.exports = { Circular, deleteCircular };
