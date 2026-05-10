const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['Pending','Confirmed','Completed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
