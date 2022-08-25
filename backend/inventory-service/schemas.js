const { Entity, Schema } = require("redis-om");

class Product extends Entity {}

// Product Schema
const productSchema = new Schema(Product, {
  merchantId: { type: "string" },
  name: { type: "text", textSearch: true },
  description: { type: "text", textSearch: true },
  category: { type: "text", textSearch: true },
  discountPrice: { type: "number" },
  images: { type: "string[]" },
  price: { type: "number" },
  quantity: { type: "number" },
  createdDate: { type: "date" },
  modifiedDate: { type: "date" },
});

module.exports = {
  productSchema,
};
