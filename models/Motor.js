const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Motor = new Schema({
  cylinders: {
    type: Number,
    required: true,
    min: 1,
    max: 48,
  },
  displacement: {
    type: Number,
    required: true,
    min: 0,
    max: 30,
  },
  fuel: {
    type: String,
    enum: ['diesel', 'petrol', 'ethanol'],
    required: true,
  },
});

module.exports = Motor;
