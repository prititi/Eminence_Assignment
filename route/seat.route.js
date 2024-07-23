const express = require("express");
const router = express.Router();
const { Seat } = require("../model/seat.model");

// Function to find contiguous seats in a row
const findContiguousSeats = async (numSeats) => {
  const rows = Math.ceil(80 / 7);
  for (let i = 0; i < rows; i++) {
    const start = i * 7;
    const end = Math.min(start + 7, 80);
    const rowSeats = await Seat.find({ number: { $gte: start + 1, $lte: end }, status: false });
    if (rowSeats.length >= numSeats) {
      const bookedSeats = rowSeats.slice(0, numSeats).map((seat) => seat.number);
      return bookedSeats;
    }
  }
  return null;
};

// Function to find nearby seats if contiguous seats are not available
const findNearbySeats = async (numSeats) => {
  const availableSeats = await Seat.find({ status: false }).limit(numSeats);
  if (availableSeats.length === numSeats) {
    return availableSeats.map((seat) => seat.number);
  }
  return null;
};

// Route to get seat availability
router.get("/seats", async (req, res) => {
  const seats = await Seat.find();
  res.json({ seats });
});
module.exports = { seatRoutes: router };
