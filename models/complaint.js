const mongoose = require("mongoose");
const moment = require("moment");

mongoose.connect("mongodb://localhost:27017/smartSocietyDB");

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  filedOn: { type: String, required: true },
  filedBy: { type: String, required: true },
  comment: { type: String, default: "No comment from admin yet." },
  status: { type: String, default: "pending" },
  society: { type: mongoose.Types.ObjectId, required: true }, // link to the society collection
});

const Complaint = new mongoose.model("Complaint", complaintSchema);
