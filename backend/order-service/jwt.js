const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports = {
  verifyMerchantToken: (token) => {
    return jwt.verify(token, process.env.MERCHANT_JWT_SECRET);
  },
  verifyCustomerToken: (token) => {
    return jwt.verify(token, process.env.CUSTOMER_JWT_SECRET);
  },
};
