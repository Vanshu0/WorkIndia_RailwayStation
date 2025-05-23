const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { verifyAuthToken } = require('../middleware/authMiddleware');

// Register User
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await db.User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.User.create({ name, email, password: hashedPassword });
        
        res.status(201).json({ message: 'User registered', user: { id: user.id, email: user.email } });
    } catch (err) {
       console.error('Registration Error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
      
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Trains with Seat Availability
router.get('/availability', verifyAuthToken, async (req, res) => {
    const { source, destination } = req.query;
    try {
        const trains = await db.Train.findAll({
            where: { source, destination },
            include: [{ model: db.SeatAvailability }]
        });
        res.json(trains);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Book a Seat (Handles Race Conditions)
router.post('/book', verifyAuthToken, async (req, res) => {
    const { trainId } = req.body;
    const userId = req.user.userId;

    try {
        const result = await db.sequelize.transaction(async (t) => {
  const seat = await db.SeatAvailability.findOne({ 
    where: { trainId }, 
    lock: t.LOCK.UPDATE, 
    transaction: t 
  });
  
  if (!seat || seat.availableSeats <= 0) {
    throw new Error('No seats available');
  }

  // Validate IDs exist
  if (!userId || !trainId) {
    throw new Error('Missing user or train ID');
  }

  seat.availableSeats -= 1;
  await seat.save({ transaction: t });
  
  const booking = await db.Booking.create({ 
    UserId: userId,  // Explicitly use passed userId
    TrainId: trainId, // Explicitly use passed trainId
    status: 'confirmed'
  }, { transaction: t });
  
  return booking;
});

        res.status(201).json({ message: 'Booking successful', booking: result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get Specific Booking
router.get('/booking/:id', verifyAuthToken, async (req, res) => {
    const bookingId = req.params.id;
    const userId = req.user.userId;
    try {
        const booking = await db.Booking.findOne({
            where: { id: bookingId, userId },
            include: [{ model: db.Train }]
        });

        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
