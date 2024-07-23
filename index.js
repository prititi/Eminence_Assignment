const express = require("express");
const { connection } = require("./config/db");
const cors = require("cors");
const { seatRoutes } = require("./route/seat.route");
const { initializeSeats } = require("./model/seat.model");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to ticket booking system!");
});

app.use("/api", seatRoutes);

app.listen(process.env.Port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
    await initializeSeats();
  } catch (err) {
    console.log(err.message);
  }
  console.log(`Server is running at port ${process.env.Port}`);
});
