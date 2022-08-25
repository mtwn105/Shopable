const { Entity, Schema } = require("redis-om");

class Customer extends Entity {}

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

module.exports = {
  customerSchema,
};
