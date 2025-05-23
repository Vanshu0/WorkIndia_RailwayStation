// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../models');

// Add a new train
router.post('/train', async (req, res) => {
    const { name, source, destination, totalSeats } = req.body;
    try {
        const train = await db.Train.create({ name, source, destination });
        const x=await db.SeatAvailability.create({ trainId: train.id, availableSeats: totalSeats,TrainId: train.id });
        res.status(201).json({ message: 'Train added successfully', train,x });
    } catch (err) {
        res.status(500).json({ error: 'Error adding train' });
    }
});

// Update total seats for a train
router.put('/train/:id/seats', async (req, res) => {
    const trainId = req.params.id;
    const { totalSeats } = req.body;
    try {
        const seat = await db.SeatAvailability.findOne({ where: { trainId } });
        if (!seat) return res.status(404).json({ error: 'Train not found' });

        seat.availableSeats = totalSeats;
        await seat.save();
        res.json({ message: 'Seats updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error updating seats' });
    }
});

module.exports = router;