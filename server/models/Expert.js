const mongoose = require('mongoose');

const ExpertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['Tech','Finance','Health','Legal','Career'] },
  experience: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  bio: { type: String, required: true },
  avatar: { type: String },
  availableSlots: [{
    date: { type: String, required: true },
    time: { type: String, required: true },
    isBooked: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Expert', ExpertSchema);
