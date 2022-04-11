const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MotorSchema = require('./Motor');
const Car = new Schema({
  license: {
    type: String,
    maxlength: 7,
    match: /[A-Z]{3}-[0-9]{3}/,
    minlength: 7,
    unique: true,
    required: true,
  },
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
  year: {
    type: Number,
    max: new Date().getFullYear(),
    min: 1888,
    required: true,
  },
  kilometers: {
    type: Number,
    max: 999999,
    min: 0,
    required: true,
  },
  motor: {
    type: MotorSchema,
    required: true,
  },
  user: {
    type: String,
    maxlength: 30,
    required: true,
  },
});
const model = mongoose.model('Car', Car);
module.exports = model;
