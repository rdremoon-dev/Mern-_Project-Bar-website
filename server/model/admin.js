const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Reservation Manager' },
  avatar: { type: String, default: '' },
});

module.exports = mongoose.model('Admin', adminSchema);
