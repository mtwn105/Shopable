const { Entity, Schema } = require("redis-om");

class Customer extends Entity {}
class Cart extends Entity {}
class CartItems extends Entity {}

// Customer Schema
const customerSchema = new Schema(Customer, {
  merchantId: { type: "string" },
  name: { type: "string" },
  phoneNumber: { type: "number" },
  email: { type: "string" },
  password: { type: "string" },
  createdDate: { type: "date" },
  modifiedDate: { type: "date" },
});

// Cart Schema
const cartSchema = new Schema(Cart, {
  customerId: { type: "string" },
  items: { type: "string[]" },
  totalPrice: { type: "number" },
});

// Cart Items Schema
const cartItemsSchema = new Schema(CartItems, {
  productId: { type: "string" },
  quantity: { type: "number" },
});

module.exports = {
  customerSchema,
  cartSchema,
  cartItemsSchema,
};
