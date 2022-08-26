const { Entity, Schema } = require("redis-om");

class Order extends Entity {}
class OrderItems extends Entity {}

// Order Schema
const orderSchema = new Schema(Order, {
  merchantId: { type: "string" },
  customerId: { type: "string" },
  status: { type: "string" },
  price: { type: "number" },
  name: { type: "string" },
  phoneNumber: { type: "number" },
  email: { type: "string" },
  address: { type: "string" },
  state: { type: "string" },
  country: { type: "string" },
  createdDate: { type: "date" },
  modifiedDate: { type: "date" },
});

// Order Items Schema
const orderItemsSchema = new Schema(OrderItems, {
  orderId: { type: "string" },
  productId: { type: "string" },
  quantity: { type: "number" },
  price: { type: "number" },
});

module.exports = {
  orderSchema,
  orderItemsSchema,
};
