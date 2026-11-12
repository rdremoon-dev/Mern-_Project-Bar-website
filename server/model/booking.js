const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    area: { type: String, required: true },
    occasion: { type: String, default: 'None' },
    requests: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending', // <-- Starts as pending
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Booking', bookingSchema);
