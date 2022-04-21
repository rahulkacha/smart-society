const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
  state: [{ type: String }],
});

State = new mongoose.model("State", stateSchema);

const citySchema = new mongoose.Schema({
  city: [{ type: String }],
});

const City = new mongoose.model("City", citySchema);

module.exports = { State, City };
