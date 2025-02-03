const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  field1: { type: Number, required: true }, // Example: temperature, sales, stock prices
  field2: { type: Number, required: true }, // Example: humidity, customer satisfaction, product rating
  field3: { type: Number, required: true }, // Example: CO2 levels, units sold, website traffic
});

module.exports = mongoose.model('Measurement', measurementSchema);