const { functions } = require("lodash");
const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/smartSocietyDB");

const societySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  societyCode: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  users: [{ type: mongoose.Types.ObjectId }],
});

const Society = mongoose.model("Society", societySchema);

function deleteSociety(societyId) {
  Society.findByIdAndDelete(societyId, (err, obj) => {
    if (err) {
      console.log(err);
    } else {
      console.log(obj);
    }
  });
}

module.exports = { Society, deleteSociety };
