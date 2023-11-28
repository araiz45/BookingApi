const fs = require("fs");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const PlaceModel = require("./models/Places.js");
const imageDownloader = require("image-downloader");
const UserModel = require("./models/User.js");
const BookingModel = require("./models/Booking.js");
const multer = require("multer");
require("dotenv").config();
const app = express();
const bcrpytSalt = bcryptjs.genSaltSync(10);
mongoose.connect(process.env.MONGO_URL);
const jwtSecret = "askldjflksadjf;lkasldkfj;lskdjflskdjf;lasd";
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.get("/test", (req, res) => {
  res.json("test ok");
});

function getUserDataFromReq(req) {
  return new Promise((ressolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      ressolve(userData);
    });
  });
}

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userDoc = await UserModel.create({
      name,
      email,
      password: bcryptjs.hashSync(password, bcrpytSalt),
    });
    res.json(userDoc);
  } catch (error) {
    res.status(422).json("Entry has been doubled");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await UserModel.findOne({ email });
  if (userDoc) {
    const passOk = bcryptjs.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id, name: userDoc.name },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("pass no ok");
    }
    // res.json("found");
  } else {
    res.json("not found");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await UserModel.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
  //   res.json({ token });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  const { Link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: Link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

const photosMiddlewear = multer({ dest: "uploads/" });

app.post("/upload", photosMiddlewear.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

app.post("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  // console.log(req.body, token);
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    console.log(addedPhotos);
    const placeDoc = await PlaceModel.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    // res.json(placeDoc);
    console.log(placeDoc);
    res.json("done");
  });
});

app.get("/places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await PlaceModel.find({ owner: id }));
  });
});

app.get("/places/:id", async (req, res) => {
  res.json(await PlaceModel.findById(req.params.id));
});

app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    id,
    price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await PlaceModel.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json("ok");
      // }
    }
  });
  // res.json(token);
});

app.get("/all-places", async (req, res) => {
  res.json(await PlaceModel.find({}));
});

app.get("/place/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json("no id avaliable ");
  }
  const placeDoc = await PlaceModel.findById(id);
  res.json(placeDoc);
});

app.post("/bookings", async (req, res) => {
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
});

app.get("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await BookingModel.find({ user: userData.id }).populate("place"));
});

app.listen(4000);
