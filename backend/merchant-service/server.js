const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
// const axios = require("axios").default;
const { v4: uuidv4 } = require("uuid");

const { connectToRedis } = require("./redis");
const connectDB = require("./mongo");
const { Merchant } = require("./schemas");

require("dotenv").config();

connectDB();

const app = express();

app.use(express.json());
app.use(express.text());
app.use(morgan("tiny"));
app.use(cors());

let client = null;

// Register a Merchant
app.post("/api/merchant", async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber,
      shopName,
      shopUniqueName,
      shopLogo,
    } = req.body;
    req.body;

    // Check if the merchant with this email or shopname or shopuniquename ignoring cases already exists
    let merchant = await Merchant.findOne({
      $or: [
        { email: { $regex: new RegExp(email, "i") } },
        { shopName: { $regex: new RegExp(shopName, "i") } },
        { shopUniqueName: { $regex: new RegExp(shopUniqueName, "i") } },
      ],
    });

    if (merchant) {
      return res.status(400).json({ message: "Merchant already exists" });
    }

    // Check if basic fields are present
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Generate Merchant Id
    const merchantId = uuidv4();

    merchant = new Merchant({
      id: merchantId,
      firstName,
      lastName,
      email,
      password,
      address,
      phoneNumber,
      shopName,
      shopUniqueName,
      shopLogo,
      createdDate: new Date(),
      modifiedDate: new Date(),
    });

    // Validate no fields are empty using mongoose
    const error = merchant.validateSync();
    if (error && error.message) {
      // Return all errors
      return res
        .status(400)
        .json({ message: "Error while saving Merchant", error: error.message });
    }

    // Encrypt password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    merchant.password = hashedPassword;

    merchant = await merchant.save();

    res.status(201).json(merchant);
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
  client = await connectToRedis();
  client.ping();
});

module.exports = app;
