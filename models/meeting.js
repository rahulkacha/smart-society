const mongoose = require("mongoose");
const Society = require("./society");
const moment = require("moment");

// mongoose.connect("mongodb://localhost:27017/smartSocietyDB");

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  agenda: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: Date, required: true },
  society: { type: mongoose.Types.ObjectId, required: true }, // link to the society collection
  details: { type: String, default: "-" },
  venue: { type: String, default: "-" },
});

const Meeting = new mongoose.model("Meeting", meetingSchema);

function deleteMeeting(societyId) {
  Meeting.deleteMany({ society: societyId }, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
      console.log(obj);
    }
  });
}

module.exports = { Meeting, deleteMeeting };
