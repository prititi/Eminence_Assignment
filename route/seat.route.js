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

// Route to book seats
router.post("/book", async (req, res) => {
  const numSeats = req.body.numSeats;
  if (numSeats < 1 || numSeats > 7) {
    return res.status(400).json({ error: "Can only book between 1 and 7 seats" });
  }
  const contiguousSeats = await findContiguousSeats(numSeats);
  if (contiguousSeats) {
    await Seat.updateMany({ number: { $in: contiguousSeats } }, { status: true });
    const updatedSeats = await Seat.find({ number: { $in: contiguousSeats } });
    return res.json({ bookedSeats: updatedSeats });
  }
  const nearbySeats = await findNearbySeats(numSeats);
  if (nearbySeats) {
    await Seat.updateMany({ number: { $in: nearbySeats } }, { status: true });
    const updatedSeats = await Seat.find({ number: { $in: nearbySeats } });
    return res.json({ bookedSeats: updatedSeats });
  }
  return res.status(400).json({ error: "Not enough seats available" });
});
// Route to get seat availability
router.get("/seats", async (req, res) => {
  const seats = await Seat.find();
  res.json({ seats });
});
module.exports = { seatRoutes: router };
