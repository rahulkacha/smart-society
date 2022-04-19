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
