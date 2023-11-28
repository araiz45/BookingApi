const express = require("express");
const {
  addPlaces,
  getPlaces,
  placesById,
  editPlaces,
  allPlaces,
  getPlacesById,
} = require("../controllers/placeControllers");

const router = express.Router();

router.post("/places", addPlaces);

router.get("/places", getPlaces);

router.get("/places/:id", placesById);

router.put("/places", editPlaces);

router.get("/all-places", allPlaces);

router.get("/place/:id", getPlacesById);

module.exports = router;
