const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/smartSocietyDB");

const stateSchema = new mongoose.Schema({
  state: [{ type: String }],
});

State = new mongoose.model("State", stateSchema);

const citySchema = new mongoose.Schema({
  city: [{ type: String }],
});

const City = new mongoose.model("City", citySchema);

module.exports = { State, City };
