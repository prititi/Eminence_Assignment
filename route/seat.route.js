const express = require("express");
const router = express.Router();
const { Seat } = require("../model/seat.model");

// Route to get seat availability
router.get("/seats", async (req, res) => {
  const seats = await Seat.find();
  res.json({ seats });
});

module.exports = { seatRoutes: router };
