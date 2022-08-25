const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports = {
  generateToken: (payload) => {
    return jwt.sign(JSON.parse(payload), process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  },
};
