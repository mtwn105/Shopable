const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.text());
app.use(morgan("tiny"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.use(multerMid.single("file"));

const uploadImage = (file) =>
  new Promise((resolve, reject) => {
    const util = require("util");
    const gc = require("./config");
    const bucket = gc.bucket("shoppable-images");

    const { originalname, buffer } = file;

    // Get file extension
    const extension = originalname.split(".").pop();

    const fileName = uuidv4() + "." + extension;

    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on("finish", () => {
        const publicUrl = util.format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        resolve(publicUrl);
      })
      .on("error", () => {
        reject(`Unable to upload image, something went wrong`);
      })
      .end(buffer);
  });

app.post("/api/upload", async (req, res, next) => {
  try {
    const myFile = req.file;
    const imageUrl = await uploadImage(myFile);
    res.status(200).json({
      message: "Upload was successful",
      data: imageUrl,
    });
  } catch (error) {
    next(error);
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
  console.log("File Upload Service is running");

  // Write a file by reading secret
  const gcsKeyEncoded = process.env.GCS_KEY;
  const gcsKey = Buffer.from(gcsKeyEncoded, "base64").toString("ascii");

  fs.writeFile("keys.json", gcsKey, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("The file was saved!");
  });
});

module.exports = app;
