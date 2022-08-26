const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios").default;
const {
  getConnection,
  getOrderRepository,
  getOrderItemsRepository,
} = require("./redis");
const { verifyMerchantToken, verifyCustomerToken } = require("./jwt");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.text());
app.use(morgan("tiny"));
app.use(cors());

// JWT Verify Middleware
const jwtVerify = (req, res, next) => {
  if (req.headers.authorization) {
    let token = req.headers["authorization"];
    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    try {
      token = token.split(" ")[1];

      const isMerchant = req.path.includes("merchant");

      const decoded = isMerchant
        ? verifyMerchantToken(token)
        : verifyCustomerToken(token);
      if (!decoded) {
        return res.status(401).send("Unauthorized");
      }

      if (isMerchant) req.body.merchantId = decoded.entityId;
      else req.body.customerId = decoded.entityId;

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
};

app.use(jwtVerify);

// Place Order
app.post("/api/order/customer", async (req, res, next) => {
  const {
    merchantId,
    customerId,
    name,
    phoneNumber,
    email,
    address,
    state,
    country,
    items,
  } = req.body;

  const orderRepository = getOrderRepository();
  const orderItemsRepository = getOrderItemsRepository();

  try {
    // Create Order Items
    let orderItems = [];
    let totalPrice = 0;

    // Check if product is in stock
    for (let i = 0; i < items.length; i++) {
      const { productId, quantity, price } = items[i];
      const product = await axios.get(
        `${process.env.INVENTORY_SERVICE_URL}/api/product/get/${productId}`
      );
      if (product.data.quantity < quantity) {
        return res.status(400).send(`${product.name} has not enough stock`);
      }
      orderItems.push({ productId, quantity, price });
      totalPrice += quantity * price;
    }

    // Create Order
    let order = {
      merchantId,
      customerId,
      status: "PLACED",
      price: totalPrice,
      name,
      phoneNumber,
      email,
      address,
      state,
      country,
      createdDate: new Date(),
      modifiedDate: new Date(),
    };

    order = await orderRepository.createAndSave(order);

    // Create Order Items
    for (let i = 0; i < orderItems.length; i++) {
      orderItems[i].orderId = order.entityId;
      await orderItemsRepository.createAndSave(orderItems[i]);
    }

    // Update Product Stock
    for (let i = 0; i < items.length; i++) {
      const { productId, quantity } = items[i];
      await axios.put(
        `${process.env.INVENTORY_SERVICE_URL}/api/product/stock/${productId}`,
        { quantity: -quantity }
      );
    }

    // Send Order In Redis Stream
    const connection = getConnection();

    const response = {
      entityId: order.entityId,
      merchantId: order.merchantId,
      customerId: order.customerId,
      status: order.status,
      price: order.price,
      name: order.name,
      phoneNumber: order.phoneNumber,
      email: order.email,
      address: order.address,
      state: order.state,
      country: order.country,
      items,
    };

    await connection.xAdd("orders-update", "*", {
      orderId: order.entityId,
      status: order.status,
    });

    return res.status(200).send(response);
  } catch (err) {
    next(err);
  }
});

// Get All Customer Order
app.get("/api/order/customer", async (req, res, next) => {
  const { customerId } = req.body;

  const orderRepository = getOrderRepository();

  try {
    const orders = await orderRepository
      .search()
      .where("customerId")
      .equals(customerId)
      .sortBy("createdDate", "DESC")
      .return.all();

    return res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
});

// Get a customer order
app.get("/api/order/customer/:orderId", async (req, res, next) => {
  const { orderId } = req.params;

  const orderRepository = getOrderRepository();

  try {
    const order = await orderRepository.fetch(orderId);

    if (!order || order.customerId !== req.body.customerId) {
      return res.status(404).send("Order not found");
    }

    return res.status(200).send(order);
  } catch (err) {
    next(err);
  }
});

// Cancel Customer Order
app.delete("/api/order/customer/:orderId", async (req, res, next) => {
  const { orderId } = req.params;

  const orderRepository = getOrderRepository();

  try {
    const order = await orderRepository.fetch(orderId);

    if (!order || order.customerId !== req.body.customerId) {
      return res.status(404).send("Order not found");
    }

    order.status = "CANCELLED";

    await orderRepository.save(order);

    const connection = getConnection();

    await connection.xAdd("orders-update", "*", {
      orderId: order.entityId,
      status: order.status,
    });

    return res.status(200).send(order);
  } catch (err) {
    next(err);
  }
});

// Get All Merchant Order
app.get("/api/order/merchant", async (req, res, next) => {
  const orderRepository = getOrderRepository();

  try {
    const orders = await orderRepository
      .search()
      .where("merchantId")
      .equals(req.body.merchantId)
      .sortBy("createdDate", "DESC")
      .return.all();

    return res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
});

// Get a merchant order
app.get("/api/order/merchant/:orderId", async (req, res, next) => {
  const { orderId } = req.params;

  const orderRepository = getOrderRepository();

  try {
    const order = await orderRepository.fetch(orderId);

    if (!order || order.merchantId !== req.body.merchantId) {
      return res.status(404).send("Order not found");
    }

    return res.status(200).send(order);
  } catch (err) {
    next(err);
  }
});

// Update Merchant Order Status
app.put("/api/order/merchant/:orderId", async (req, res, next) => {
  const { orderId } = req.params;

  const orderRepository = getOrderRepository();

  try {
    const order = await orderRepository.fetch(orderId);

    if (!order || order.merchantId !== req.body.merchantId) {
      return res.status(404).send("Order not found");
    }

    order.status = req.body.status;

    await orderRepository.save(order);

    const connection = getConnection();

    await connection.xAdd("orders-update", "*", {
      orderId: order.entityId,
      status: order.status,
    });

    return res.status(200).send(order);
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
  console.log("Order Service is running");
});

module.exports = app;
