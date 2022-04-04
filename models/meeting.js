const mongoose = require("mongoose");
const Society = require("./society");
const moment = require("moment");

// mongoose.connect("mongodb://localhost:27017/smartSocietyDB");

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  agenda: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  society: { type: mongoose.Types.ObjectId, required: true }, // link to the society collection
  details: { type: String, default: "-" },
  venue: { type: String, default: "-" },
});

const Meeting = new mongoose.model("Meeting", meetingSchema);

// ADDS A NEW MEETING
Society.find({ _id: "624ae7a023653564cc302c25" }, (err, obj) => {
  if (err) {
    console.log(err);
  } else {
    const soc_obj = obj[0];
    const dateTime = "2022-04-25T20:00"; // req.body.dateTime
    const date = moment(dateTime).format("DD/MM/YYYY");
    const time = moment(dateTime).format("hh:mm A");

    const meeting = new Meeting({
      title: "req.body.title",
      agenda: "req.body.agenda",
      date: moment(dateTime).format("DD/MM/YYYY"), // parsed date
      time: moment(dateTime).format("hh:mm A"), // parsed time
      society: soc_obj._id, // add society ID from the user session
      details: "req.body.details",
      venue: "req.body.venue",
    });

    meeting.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("successfully added a new meeting.");
      }
    });
  }
});

// CHECK WHETHER SOCIETY CAN BE RETRIEVED BY MEETING ID

module.exports = Meeting;
