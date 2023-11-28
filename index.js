const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRoute = require("./routes/userRoute.js");
const uploadRoute = require("./routes/uploadRoute.js");
const placeRoute = require("./routes/placeRoute.js");
const bookingRoute = require("./routes/bookingRoute.js");

require("dotenv").config();
mongoose.connect(process.env.MONGO_URL);
const app = express();
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
// user routes
app.use("/api/user", userRoute);

// upload routes
app.use("/api/photo", uploadRoute);

// places routes

app.use("/api/accomodations", placeRoute);

// booking routes
app.use("/api/book", bookingRoute);

app.listen(4000, () => {
  console.log("App is Listening at 4000");
});

/*
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const fs = require("fs");
const PlaceModel = require("./models/Places.js");
const imageDownloader = require("image-downloader");
const BookingModel = require("./models/Booking.js");
const multer = require("multer");
const bcrpytSalt = bcryptjs.genSaltSync(10);
const jwtSecret = "askldjflksadjf;lkasldkfj;lskdjflskdjf;lasd";
*/
