const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { getProductRepository } = require("./redis");
const { verifyToken } = require("./jwt");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.text());
app.use(morgan("tiny"));
app.use(cors());

// JWT Verify Middleware
const jwtVerify = (req, res, next) => {
  if (
    !req.path.startsWith("/api/product/all") &&
    !req.path.startsWith("/api/product/search") &&
    !req.path.startsWith("/api/product/stock") &&
    !req.path.startsWith("/api/product/get")
  ) {
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

        req.body.merchantId = decoded.entityId;

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

// Create Product
app.post("/api/product/create", async (req, res, next) => {
  const {
    merchantId,
    name,
    description,
    category,
    discountPrice,
    images,
    price,
    quantity,
  } = req.body;

  const productRepository = getProductRepository();

  try {
    const product = await productRepository.createAndSave({
      merchantId,
      name,
      description,
      category,
      discountPrice,
      images,
      price,
      quantity,
      createdDate: new Date(),
      modifiedDate: new Date(),
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// Get Product
app.get("/api/product/get/:id", async (req, res, next) => {
  const { id } = req.params;

  const productRepository = getProductRepository();

  try {
    const product = await productRepository.fetch(id);

    if (!product || !product.merchantId) {
      return res.status(404).send("Product not found");
    }

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});

// Update Product
app.put("/api/product/update/:id", async (req, res, next) => {
  const { id } = req.params;

  const {
    merchantId,
    name,
    description,
    category,
    discountPrice,
    images,
    price,
    quantity,
  } = req.body;

  const productRepository = getProductRepository();

  try {
    let product = await productRepository.fetch(id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    if (product.merchantId !== merchantId) {
      return res.status(401).send("Unauthorized");
    }

    product.name = name;
    product.description = description;
    product.category = category;
    product.discountPrice = discountPrice;
    product.images = images;
    product.price = price;
    product.quantity = quantity;
    product.modifiedDate = new Date();

    product = await productRepository.save(product);

    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});

// Delete Product
app.delete("/api/product/delete/:id", async (req, res, next) => {
  const { id } = req.params;

  const { merchantId } = req.body;

  const productRepository = getProductRepository();

  try {
    let product = await productRepository.fetch(id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    if (product.merchantId !== merchantId) {
      return res.status(401).send("Unauthorized");
    }

    await productRepository.remove(id);

    res.status(200).send("Product deleted");
  } catch (err) {
    next(err);
  }
});

// Get all products by merchant
app.get("/api/product/all/:merchantId", async (req, res, next) => {
  const { merchantId } = req.params;

  const productRepository = getProductRepository();

  try {
    const products = await productRepository
      .search()
      .where("merchantId")
      .equals(merchantId)
      .return.all();

    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

// Search Product
app.get("/api/product/search", async (req, res, next) => {
  const { q } = req.query;

  const productRepository = getProductRepository();

  try {
    const products = await productRepository
      .search()
      .where("name")
      .matches(q)
      .or("description")
      .matches(q)
      .or("category")
      .matches(q)
      .return.all();

    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

// Update Product Stock
app.put("/api/product/stock/:id", async (req, res, next) => {
  const { id } = req.params;

  const { quantity } = req.body;

  const productRepository = getProductRepository();

  try {
    let product = await productRepository.fetch(id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    product.quantity += quantity;
    product.modifiedDate = new Date();

    product = await productRepository.save(product);

    res.status(200).json(product);
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
