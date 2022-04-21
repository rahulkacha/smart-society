const mongoose = require("mongoose");

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
