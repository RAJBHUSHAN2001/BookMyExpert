const express = require('express');
const router = express.Router();
const { createBooking, updateBookingStatus, getBookingsByEmail, getAllBookings } = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/all', getAllBookings);
router.patch('/:id/status', updateBookingStatus);
router.get('/', getBookingsByEmail);

module.exports = router;
