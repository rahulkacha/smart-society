const mongoose = require("mongoose");

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
