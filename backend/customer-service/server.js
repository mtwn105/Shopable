const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios").default;
const bcrypt = require("bcrypt");
const {
  getCustomerRepository,
  getCartRepository,
  getCartItemsRepository,
} = require("./redis");
const { generateToken, verifyToken } = require("./jwt");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.text());
app.use(morgan("tiny"));
app.use(cors());

// JWT Verify Middleware
const jwtVerify = (req, res, next) => {
  if (
    !req.path.startsWith("/api/customer/register") &&
    !req.path.startsWith("/api/customer/login")
  ) {
    if (req.headers.authorization) {
      let token = req.headers["authorization"];
      if (!token) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      try {
        token = token.split(" ")[1];

        const decoded = verifyToken(token);
        if (!decoded) {
          return res.status(401).json({
            message: "Unauthorized",
          });
        }

        req.body.customerId = decoded.entityId;

        next();
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            message: "Token Expired",
          });
        }
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
    } else {
      return res.status(401).json({
        message: "Unauthorized",
      });
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
      .and("merchantId")
      .equals(merchantId)
      .first();

    if (customer) {
      return res.status(409).send({ message: "Customer already exists" });
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
  const { merchantId, email, password } = req.body;

  const customerRepository = getCustomerRepository();

  try {
    // Check if customer already exists
    const customer = await customerRepository
      .search()
      .where("email")
      .equals(email)
      .and("merchantId")
      .equals(merchantId)
      .first();

    if (!customer) {
      return res.status(404).send({ message: "Customer not found" });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, customer.password);
    if (!isPasswordCorrect) {
      return res.status(401).send({ message: "Incorrect password" });
    }

    // Create JWT
    const token = generateToken(JSON.stringify(customer));

    return res.status(200).send({
      message: "Login successful",
      token,
      customer,
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
    const customer = await customerRepository.fetch(id);

    if (!customer) {
      return res.status(404).send({ message: "Customer not found" });
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
      return res.status(404).send({ message: "Customer not found" });
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

// Get Cart
app.get("/api/customer/cart/:id", async (req, res, next) => {
  const { id } = req.params;

  const cartRepository = getCartRepository();

  try {
    const cart = await cartRepository
      .search()
      .where("customerId")
      .equals(id)
      .first();

    if (!cart) {
      // Create Cart
      const cart = await cartRepository.createAndSave({
        customerId: id,
        items: [],
        totalPrice: 0,
        createdDate: new Date(),
        modifiedDate: new Date(),
      });

      return res.status(200).send(cart);
    } else {
      // Fetch cart items
      const cartItemsRepository = getCartItemsRepository();
      const cartItems = [];
      let totalPrice = 0;

      for (const item of cart.items) {
        const cartItem = await cartItemsRepository.fetch(item);

        // Fetch product details
        const productData = await axios.get(
          process.env.INVENTORY_SERVICE_URL +
            "/api/product/get/" +
            cartItem.productId
        );

        const product = productData.data;

        cartItems.push({
          productId: cartItem.productId,
          productName: product.name,
          productCategory: product.category,
          quantity: cartItem.quantity,
          price: product.discountPrice,
          totalPrice: cartItem.quantity * product.discountPrice,
        });

        totalPrice += product.discountPrice * cartItem.quantity;
      }

      return res.status(200).send({
        items: cartItems,
        totalPrice,
      });
    }
  } catch (err) {
    next(err);
  }
});

// Update Cart
app.put("/api/customer/cart/:id", async (req, res, next) => {
  const { id } = req.params;

  const cartRepository = getCartRepository();

  try {
    const cart = await cartRepository
      .search()
      .where("customerId")
      .equals(id)
      .first();

    if (!cart) {
      // Create Cart
      const cart = await cartRepository.createAndSave({
        customerId: id,
        items: [],
        totalPrice: 0,
        createdDate: new Date(),
        modifiedDate: new Date(),
      });

      return res.status(200).send(cart);
    } else {
      const { items } = req.body;

      const cartItemsRepository = getCartItemsRepository();

      const cartItems = [];
      let totalPrice = 0;

      // Delete all cart items
      if (!!cart.items && cart.items.length > 0) {
        for (let i = 0; i < cart.items.length; i++) {
          await cartItemsRepository.remove(cart.items[i]);
        }
      } else {
        cart.items = [];
      }

      // Create new cart items
      for (let i = 0; i < items.length; i++) {
        // Fetch product details
        const productData = await axios.get(
          process.env.INVENTORY_SERVICE_URL +
            "/api/product/get/" +
            items[i].productId
        );

        const product = productData.data;

        const cartItem = await cartItemsRepository.createAndSave({
          productId: items[i].productId,
          quantity: items[i].quantity,
          price: product.discountPrice,
          totalPrice: items[i].quantity * product.discountPrice,
        });
        cartItems.push(cartItem.entityId);
        totalPrice += cartItem.totalPrice;
      }

      cart.items = cartItems;
      cart.totalPrice = totalPrice;

      cart.modifiedDate = new Date();

      await cartRepository.save(cart);

      return res.status(200).send(cart);
    }
  } catch (err) {
    next(err);
  }
});

// Add to Cart
app.post("/api/customer/cart/:id", async (req, res, next) => {
  const { id } = req.params;

  const { productId } = req.body;

  const cartRepository = getCartRepository();
  const cartItemsRepository = getCartItemsRepository();

  try {
    let cart = await cartRepository
      .search()
      .where("customerId")
      .equals(id)
      .first();

    if (!cart) {
      // Create Cart Item
      const cartItem = await cartItemsRepository.createAndSave({
        productId: productId,
        quantity: 1,
      });

      // Create Cart
      const cart = await cartRepository.createAndSave({
        customerId: id,
        items: [cartItem.entityId],
        createdDate: new Date(),
        modifiedDate: new Date(),
      });

      return res.status(200).send(cart);
    } else {
      // Fetch cart items
      const cartItems = [];

      for (const item of cart.items) {
        const cartItem = await cartItemsRepository.fetch(item);
        cartItems.push(cartItem);
      }

      // Check if product already exists in cart
      let cartItem = cartItems.find((item) => item.productId === productId);

      if (cartItem) {
        // Update cart item quantity
        cartItem.quantity += 1;
        await cartItemsRepository.save(cartItem);
      } else {
        // Create cart item
        const cartItem = await cartItemsRepository.createAndSave({
          productId: productId,
          quantity: 1,
        });

        cart.items.push(cartItem.entityId);

        cart.modifiedDate = new Date();

        await cartRepository.save(cart);
      }

      return res.status(200).send({ message: "Added to cart" });
    }
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
  console.log("Customer Service is running");
});

module.exports = app;
