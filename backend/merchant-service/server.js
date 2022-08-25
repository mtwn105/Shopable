const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const { getMerchantRepository } = require("./redis");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.text());
app.use(morgan("tiny"));
app.use(cors());

// Register a Merchant
app.post("/api/merchant", async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      address,
      state,
      zip,
      country,
      phoneNumber,
      shopName,
      shopUniqueName,
      shopLogo,
    } = req.body;
    req.body;

    // Check if the merchant with this email or shopname or shopuniquename ignoring cases already exists
    let merchant = await getMerchantRepository()
      .search()
      .where("email")
      .equals(email)
      .or("shopName")
      .equals(shopName)
      .or("shopUniqueName")
      .equals(shopUniqueName)
      .return.first();

    if (merchant) {
      return res.status(400).json({ message: "Merchant already exists" });
    }

    // Check if basic fields are present
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    merchant = {
      firstName,
      lastName,
      email,
      password,
      address,
      state,
      zip,
      country,
      phoneNumber,
      shopName,
      shopUniqueName,
      shopLogo,
      createdDate: new Date(),
      modifiedDate: new Date(),
    };

    // Encrypt password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    merchant.password = hashedPassword;

    merchant = await getMerchantRepository().createAndSave(merchant);

    res.status(201).json(merchant);
  } catch (err) {
    next(err);
  }
});

// Get Merchant Details
app.get("/api/merchant/:merchantId", async (req, res, next) => {
  try {
    const { merchantId } = req.params;
    const merchant = await getMerchantRepository().fetch(merchantId);

    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    res.status(200).json(merchant);
  } catch (err) {
    next(err);
  }
});

// Error Handler
const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error("Not Found - " + req.originalUrl);
  next(error);
};

const errorHandler = (err, req, res) => {
  res.status(res.statusCode || 500);
  res.json({
    error: err.name,
    message: err.message,
  });
};

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT || 3000, async function () {
  console.log("Merchant Service is running");
  // client = await connectToRedis();
});

module.exports = app;
