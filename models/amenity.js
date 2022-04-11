const mongoose = require("mongoose");
const Society = require("./society");

mongoose.connect("mongodb://localhost:27017/smartSocietyDB");

amenitySchema = new mongoose.Schema({
  society: { type: mongoose.Types.ObjectId, required: true }, // link to the society collection
  name: { type: String, required: true },
  photo: { type: String }, // will be handled when the code is integrated
  canBeBooked: { type: Boolean, default: false },
  description: { type: String, required: true },
  bookings: [
    {
      user: { type: mongoose.Types.ObjectId, required: true },
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

const Amenity = new mongoose.model("Amenity", amenitySchema);

const amenity = new Amenity({
  name: "garden lawn",
  photo: "photo path",
  description: "hkjl9789798 ijhklhljhlpsum",
  society: "62514f189dbdf6fc51f03a91",
});

// amenity.save((err, obj) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(obj);
//   }
// });

function deleteAmenity(societyId) {
  Amenity.deleteMany({ society: societyId }, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
      console.log(obj);
    }
  });
}

module.exports = { Amenity, deleteAmenity };
