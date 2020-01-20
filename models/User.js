const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
});

const User = mongoose.model('User', userSchema);

/**
 * determine if an object is a valid user
 * @param {*} user user
 * @return {Object} object
 */
function validateUser(user) {
  const schema = {
    name: Joi.string().min(1).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
  };
  return Joi.validate(user, schema);
}
exports.User = User;
exports.validate = validateUser;
