const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  number: Number,
  status: { type: Boolean, default: false }, // false for available, true for booked
});

const Seat = mongoose.model("Seat", seatSchema);

const initializeSeats = async () => {
  try {
    // Clear existing seats
    await Seat.deleteMany({});

    // Create a new set of 80 seats
    const seats = [];
    for (let i = 1; i <= 80; i++) {
      seats.push({ number: i, isBooked: false });
    }

    await Seat.insertMany(seats);
    console.log("Initialized 80 seats.");
  } catch (error) {
    console.error("Error initializing seats:", error);
  }
};

module.exports = { Seat, initializeSeats };
