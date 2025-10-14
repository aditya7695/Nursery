const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String },
  careInstructions: { type: String }
});

const Plant = mongoose.model('Plant', plantSchema);
module.exports = Plant;