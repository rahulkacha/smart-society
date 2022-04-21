const mongoose = require("mongoose");

amenitySchema = new mongoose.Schema({
  society: { type: mongoose.Types.ObjectId, required: true }, // link to the society collection
  name: { type: String, required: true },
  photo: { type: String }, // will be handled when the code is integrated
  canBeBooked: { type: Boolean, default: false },
  description: { type: String, required: true },
  bookings: [
    {
      userId: { type: mongoose.Types.ObjectId, required: true },
      name: { type: String, required: true },
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
