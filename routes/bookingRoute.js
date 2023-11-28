const express = require("express");
const { addBooking, getBooking } = require("../controllers/bookingControllers");

const router = express.Router();

router.post("/bookings", addBooking);

router.get("/bookings", getBooking);

module.exports = router;
