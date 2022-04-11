const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FavoriteSchema = require('./Favorite');

const User = new Schema({
  username: {
    type: String,
    maxlength: 30,
    minlength: 1,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  numOfCars: {
    type: Number,
    required: true,
    min: 0,
  },
  favorites: [
    {
      type: FavoriteSchema,
      required: false,
    },
  ],
  isadmin: {
    type: Boolean,
    required: true,
  },
});
const model = mongoose.model('User', User);
module.exports = model;
