const UserModel = require("../models/User.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const bcrpytSalt = bcryptjs.genSaltSync(10);
module.exports.register = async (req, res) => {
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
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDoc = await UserModel.findOne({ email });
    if (userDoc) {
      const passOk = bcryptjs.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign(
          { email: userDoc.email, id: userDoc._id, name: userDoc.name },
          process.env.JWT_SECRET,
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
  } catch (error) {
    res.status(500).json("internal server error");
  }
};

module.exports.profile = (req, res) => {
  const { token } = req.cookies;
  try {
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
        if (err) throw err;
        const { name, email, _id } = await UserModel.findById(userData.id);
        res.json({ name, email, _id });
      });
    } else {
      res.json(null);
    }
  } catch (error) {
    res.status(500).json("internal Server error");
  }
  //   res.json({ token });
};

module.exports.logout = (req, res) => {
  try {
    res.cookie("token", "").json(true);
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};
