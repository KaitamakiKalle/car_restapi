const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Favorite = new Schema({
  brand: {
    type: String,
    maxlength: 20,
    required: true,
  },
  model: {
    type: String,
    maxlength: 20,
    required: true,
  },
});

module.exports = Favorite;
