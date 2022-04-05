const mongoose = require("mongoose");
const Society = require("./society");

// mongoose.connect("mongodb://localhost:27017/smartSocietyDB");

amenitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String }, // will be handled when the code is integrated
  bookings: [
    {
      user: { type: mongoose.Types.ObjectId, required: true },
      bookFrom: { type: String, required: true },
      bookTill: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
});

Amenity = new mongoose.model("Amenity", amenitySchema);

const amenity = new Amenity({ name: "swimming pool", photo: "photo path" });

amenity.save((err, obj) => {
  if (err) {
    console.log(err);
  } else {
    console.log(obj);
  }
});