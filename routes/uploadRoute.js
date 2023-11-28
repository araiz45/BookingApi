const express = require("express");
const multer = require("multer");

const {
  uploadByLink,
  uploadByComputer,
} = require("../controllers/uploadControllers");

const router = express.Router();

router.post("/upload-by-link", uploadByLink);

const photosMiddlewear = multer({ dest: "uploads/" });

router.post("/upload", photosMiddlewear.array("photos", 100), uploadByComputer);

module.exports = router;
