const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports = {
  generateToken: (payload) => {
    return jwt.sign(JSON.parse(payload), process.env.MERCHANT_JWT_SECRET, {
      expiresIn: "1h",
    });
  },
};
