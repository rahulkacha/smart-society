const mongoose = require("mongoose");
const { Society, deleteSociety } = require("./society");
const bcrypt = require("bcrypt");
const moment = require("moment");
const saltRounds = 10;

// mongoose.connect("mongodb://localhost:27017/smartSocietyDB");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  blockNo: { type: String },
  contact: { type: String, min: 10, max: 10, required: true },
  occupantType: { type: String, default: "owner" },
  society: { type: mongoose.Types.ObjectId }, // link to the society collection
  societyCode: { type: String, required: true }, // link to society collection
  date: { type: String, required: true },
  bookings: [
    {
      amenityName: { type: String, required: true },
      amenityId: { type: mongoose.Types.ObjectId, required: true },
      bookingId: { type: mongoose.Types.ObjectId, required: true },
      bookFrom: {
        date: { type: String, required: true },
        time: { type: String, required: true },
      },
      bookTill: {
        date: { type: String, required: true },
        time: { type: String, required: true },
      },
    },
  ],
});

const User = mongoose.model("User", userSchema);

function deleteUser(societyId) {
  User.deleteMany({ society: societyId }, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
      console.log(obj);
    }
  });
}

module.exports = { User, deleteUser };
