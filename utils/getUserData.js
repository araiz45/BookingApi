const jwt = require("jsonwebtoken");
module.exports.getUserDataFromReq = (req) => {
  return new Promise((ressolve, reject) => {
    try {
      jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET,
        {},
        async (err, userData) => {
          if (err) throw err;
          ressolve(userData);
        }
      );
    } catch (error) {
      console.log("Error" + error);
    }
  });
};
