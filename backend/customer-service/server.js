const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const { getCustomerRepository } = require("./redis");
const { generateToken, verifyToken } = require("./jwt");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.text());
app.use(morgan("tiny"));
app.use(cors());

// JWT Verify Middleware
const jwtVerify = (req, res, next) => {
  if (!req.path.startsWith("/api/customer/register")) {
    if (req.headers.authorization) {
      let token = req.headers["authorization"];
      if (!token) {
        return res.status(401).send("Unauthorized");
      }

      try {
        token = token.split(" ")[1];

        const decoded = verifyToken(token);
        if (!decoded) {
          return res.status(401).send("Unauthorized");
        }

        req.body.customerId = decoded.entityId;

        next();
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).send("Token Expired");
        }
        return res.status(401).send("Unauthorized");
      }
    } else {
      return res.status(401).send("Unauthorized");
    }
  } else {
    next();
  }
};

app.use(jwtVerify);

// Register Customer
app.post("/api/customer/register", async (req, res, next) => {
  const { merchantId, name, phoneNumber, email, password } = req.body;

  const customerRepository = getCustomerRepository();

  try {
    // Check if customer already exists
    let customer = await customerRepository
      .search()
      .where("email")
      .equals(email)
      .first();

    if (customer) {
      return res.status(409).send("Customer already exists");
    }

    // Encrypt password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create customer
    customer = await customerRepository.createAndSave({
      merchantId,
      name,
      phoneNumber,
      email,
      password: hashedPassword,
      createdDate: new Date(),
      modifiedDate: new Date(),
    });

    return res.status(201).send(customer);
  } catch (err) {
    next(err);
  }
});

// Login Customer
app.post("/api/customer/login", async (req, res, next) => {
  const { email, password } = req.body;

  const customerRepository = getCustomerRepository();

  try {
    // Check if customer already exists
    const customer = await customerRepository
      .search()
      .where("email")
      .equals(email)
      .first();

    if (!customer) {
      return res.status(404).send("Customer not found");
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, customer.password);
    if (!isPasswordCorrect) {
      return res.status(401).send("Incorrect password");
    }

    // Create JWT
    const token = generateToken(customer);

    return res.status(200).send({
      message: "Login successful",
      token,
    });
  } catch (err) {
    next(err);
  }
});

// Get Customer
app.get("/api/customer/:id", async (req, res, next) => {
  const { id } = req.params;

  const customerRepository = getCustomerRepository();

  try {
    const customer = await customerRepository.get(id);

    if (!customer) {
      return res.status(404).send("Customer not found");
    } else {
      return res.status(200).send(customer);
    }
  } catch (err) {
    next(err);
  }
});

// Update Customer
app.put("/api/customer/:id", async (req, res, next) => {
  const { id } = req.params;

  const customerRepository = getCustomerRepository();

  try {
    const customer = await customerRepository.fetch(id);

    if (!customer) {
      return res.status(404).send("Customer not found");
    }

    const { name, phoneNumber, email, password } = req.body;

    if (name) {
      customer.name = name;
    }

    if (phoneNumber) {
      customer.phoneNumber = phoneNumber;
    }

    if (email) {
      customer.email = email;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      customer.password = hashedPassword;
    }

    customer.modifiedDate = new Date();

    await customerRepository.save(customer);

    return res.status(200).send(customer);
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
  console.log("Product Service is running");
});

module.exports = app;
