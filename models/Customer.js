const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255},
  isGold: {
    type: Boolean,
    required: true},
  phoneNumber: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50},
});

const Customer = mongoose.model('Customer', customerSchema);

/**
 * determine if an object is a valid customer
 * @param {*} customer customer
 * @return {Object} object
 */
function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(1).max(255).required(),
    phoneNumber: Joi.string().min(1).max(50).required(),
    isGold: Joi.boolean().required(),
  };
  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
