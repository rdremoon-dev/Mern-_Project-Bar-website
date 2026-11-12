const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: 'Events', trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Event', eventSchema);
