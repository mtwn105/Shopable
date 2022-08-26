const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios").default;
const Mailjet = require("node-mailjet");

const { getConnection } = require("./redis");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.text());
app.use(morgan("tiny"));
app.use(cors());

const sendEmail = async (order) => {
  const mailjet = new Mailjet({
    apiKey: process.env.MAILJET_API_KEY,
    apiSecret: process.env.MAILJET_API_SECRET,
  });

  try {
    const request = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "mail@amitwani.dev",
            Name: "Shoppable",
          },
          To: [
            {
              Email: order.email,
              Name: order.name,
            },
          ],
          TemplateID: +process.env.MAILJET_TEMPLATE_ID,
          TemplateLanguage: true,
          Subject: "Order Update: " + order.entityId,
          Variables: {
            order_id: order.entityId,
            firstname: order.name,
            order_status: order.status,
            total_price: order.price,
            order_date: order.createdDate,
          },
        },
      ],
    });

    console.log(`Email sent to ${order.email}`);
  } catch (err) {
    console.error(`Email failed to send to ${order.email}`, err);
  }
};

const listenToOrderUpdates = async () => {
  const connection = await getConnection();

  let currentId = "0-0"; // Start at lowest possible stream ID

  while (true) {
    try {
      let response = await connection.xRead(
        [
          // XREAD can read from multiple streams, starting at a
          // different ID for each...
          {
            key: "orders-update",
            id: currentId,
          },
        ],
        {
          // Read 1 entry at a time, block for 5 seconds if there are none.
          COUNT: 1,
          BLOCK: 5000,
        }
      );

      if (response) {
        let orderUpdate = response[0].messages[0];

        // // Get the ID of the first (only) entry returned.
        currentId = orderUpdate.id;

        handleOrderUpdate(
          orderUpdate.message.orderId,
          orderUpdate.message.status
        );

        await connection.xDel("orders-update", currentId);
      } else {
        // Response is null, we have read everything that is
        // in the stream right now...
        console.log("No new stream entries.");
      }
    } catch (err) {
      console.error(err);
    }
  }
};

const handleOrderUpdate = async (orderId, status) => {
  console.log(`Order ${orderId} updated to ${status}`);

  // Fetch order details
  const orderDetails = await axios.get(
    `${process.env.ORDER_SERVICE_URL}/api/order/email/${orderId}`
  );

  console.log(orderDetails.data);

  // Format order created date to "dd-MM-yyyy HH:mm"
  orderDetails.data.createdDate = new Date(
    orderDetails.data.createdDate
  ).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Send email
  sendEmail(orderDetails.data);
};

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
  console.log("Update Service is running");
  listenToOrderUpdates();
});

module.exports = app;
