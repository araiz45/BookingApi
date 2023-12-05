const jwt = require("jsonwebtoken");
const PlaceModel = require("../models/Places.js");
module.exports.addPlaces = async (req, res) => {
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
  try {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
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
      console.log(placeDoc);
      res.json("done");
    });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

module.exports.getPlaces = (req, res) => {
  const { token } = req.cookies;
  try {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      const { id } = userData;
      const data = await PlaceModel.find({ owner: id });
      res.json(await PlaceModel.find({ owner: id }));
    });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

module.exports.placesById = async (req, res) => {
  try {
    res.json(await PlaceModel.findById(req.params.id));
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

module.exports.editPlaces = async (req, res) => {
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
  try {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
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
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
  // res.json(token);
};

module.exports.allPlaces = async (req, res) => {
  try {
    res.json(await PlaceModel.find({}));
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

module.exports.getPlacesById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json("no id avaliable ");
    }
    const placeDoc = await PlaceModel.findById(id);
    res.json(placeDoc);
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};
