const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [String],
  instructions: String,
  bakingTimeMinutes: Number,
  isGlutenFree: Boolean
});

module.exports = mongoose.model('Recipe', recipeSchema);
