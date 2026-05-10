const Booking = require('../models/Booking');
const Expert = require('../models/Expert');

exports.createBooking = async (req, res, next) => {
  try {
    const { expertId, name, email, phone, date, timeSlot, notes } = req.body;

    if (!expertId || !name || !email || !phone || !date || !timeSlot) {
      const error = new Error('All fields except notes are required');
      error.status = 400;
      throw error;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const error = new Error('Invalid email format');
      error.status = 400;
      throw error;
    }

    if (!/^\d{10}$/.test(phone)) {
      const error = new Error('Phone must be exactly 10 digits');
      error.status = 400;
      throw error;
    }

    const result = await Expert.findOneAndUpdate(
      {
        _id: expertId,
        'availableSlots.date': date,
        'availableSlots.time': timeSlot,
        'availableSlots.isBooked': false
      },
      {
        $set: { 'availableSlots.$[slot].isBooked': true }
      },
      {
        arrayFilters: [{ 'slot.date': date, 'slot.time': timeSlot, 'slot.isBooked': false }],
        new: true
      }
    );

    if (!result) {
      const error = new Error('This slot is already booked. Please choose another.');
      error.status = 409;
      throw error;
    }

    const booking = await Booking.create({ expertId, name, email, phone, date, timeSlot, notes });

    req.io.emit('slotBooked', { expertId, date, timeSlot });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed!',
      booking
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    
    if (!booking) {
      const error = new Error('Booking not found');
      error.status = 404;
      throw error;
    }

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

exports.getBookingsByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) {
      const error = new Error('Email query parameter is required');
      error.status = 400;
      throw error;
    }

    const bookings = await Booking.find({ email: new RegExp('^' + email + '$', 'i') })
      .populate('expertId', 'name category')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('expertId', 'name category avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};
