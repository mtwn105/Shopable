const { Entity, Schema } = require("redis-om");

class Merchant extends Entity {}

// Merchant Schema
const merchantSchema = new Schema(Merchant, {
  merchantId: { type: "string" },
  firstName: { type: "string" },
  lastName: { type: "string" },
  email: { type: "string" },
  password: { type: "string" },
  address: { type: "string" },
  state: { type: "string" },
  zip: { type: "string" },
  country: { type: "string" },
  phoneNumber: { type: "number" },
  shopName: { type: "string" },
  shopUniqueName: { type: "string" },
  shopLogo: { type: "string" },
  token: { type: "string" },
  createdDate: { type: "date" },
  modifiedDate: { type: "date" },
});

module.exports = {
  merchantSchema,
};
