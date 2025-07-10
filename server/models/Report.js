// models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  data: [
    {
      name: String,
      price: String,
      change: String,
      volume: String,
    }
  ],
  filename: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', reportSchema);
