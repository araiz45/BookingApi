const jwt = require("jsonwebtoken");
const jwtSecret = "askldjflksadjf;lkasldkfj;lskdjflskdjf;lasd";
module.exports.getUserDataFromReq = (req) => {
  return new Promise((ressolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      ressolve(userData);
    });
  });
};
