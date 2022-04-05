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

///////////////////////////////////////////////////////////////////////////

const id = mongoose.Types.ObjectId();
const name = "req.body.name";
const society = new Society({
  _id: id,
  name: "req.body.name",
  address: "req.body.address",
  city: "req.body.name",
  state: "req.body.address",
  postalCode: "req.body.name",
  societyCode:
    name.replace(/\s/g, "").substring(0, 4) + // removes whitespace in b/w the string
    id.toString().substring(0, 3) +
    id.toString().substring(21, 24),
});

// society.save((err, obj) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(obj);
//   }
// });

////////////////////////////////////////////////////////////////////////////

module.exports = Society;
