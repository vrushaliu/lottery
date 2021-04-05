/** Value  Model - holds numbers in key-value pairs*/

// export config file
const config = require('../config/config');
const mongoose = require('mongoose');

const valueSchema = mongoose.Schema({
  position: {
    type: Number,
    default: 0,
    required: true,
  },
  value: {
    type: Number,
    default: 0,
    required: true,
  }},
{id: false});

module.exports = mongoose.model(config.MODEL_VALUE, valueSchema);
