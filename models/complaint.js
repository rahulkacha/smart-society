const mongoose = require("mongoose");
const moment = require("moment");
const Society = require("./society");

// mongoose.connect("mongodb://localhost:27017/smartSocietyDB");

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  filedOn: { type: String, required: true },
  filedBy: {
    user: {
      userId: { type: mongoose.Types.ObjectId },
      name: { type: String },
      block: { type: String },
    },
  },
  comment: { type: String, default: "No comment from admin yet." },
  status: { type: String, default: "pending" },
  society: { type: mongoose.Types.ObjectId, required: true }, // link to the society collection
});

const Complaint = new mongoose.model("Complaint", complaintSchema);

const date = moment().format("DD/MM/YYYY");

const complaint = new Complaint({
  title: "complaint title",
  description: "ddafsfdfgf",
  filedOn: moment().format("DD/MM/YYYY"),
  filedBy: {
    user: {
      userId: "624ae7a023653564cc302c25",
      name: "user name",
      blockNo: "block No",
    },
  },
  society: "624ae7a023653564cc302c25",
});

// complaint.save((err, obj) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("succesfully added a new complaint.");
//   }
// });

function deleteComplaint(societyId) {
  Complaint.deleteMany({ society: societyId }, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
      console.log(obj);
    }
  });
}

module.exports = { Complaint, deleteComplaint };
