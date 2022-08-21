const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Merchant Schema
const merchants = new Schema({
  id: { type: String },
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  // Email Validation
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: { type: String, required: true, minlength: 6 },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  phoneNumber: { type: Number, required: true },
  shopName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  shopUniqueName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  shopLogo: { type: String, required: true },
  token: { type: String },
  createdDate: { type: Date, required: true },
  modifiedDate: { type: Date, required: true },
});

const Merchant = mongoose.model("Merchant", merchants, "merchants");

module.exports = {
  Merchant,
};
