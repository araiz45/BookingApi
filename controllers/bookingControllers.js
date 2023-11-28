const BookingModel = require("../models/Booking");
const { getUserDataFromReq } = require("../utils/getUserData");

module.exports.addBooking = async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
      req.body;
    const bookingDoc = await BookingModel.create({
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      price,
      user: userData.id,
    });
    res.json(bookingDoc);
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

module.exports.getBooking = async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    res.json(await BookingModel.find({ user: userData.id }).populate("place"));
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};
