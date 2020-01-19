const mongoose = require('mongoose');
const Joi = require('joi');

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255},
      isGold: {
        type: Boolean,
        default: false},
      phoneNumber: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50},
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 255},
      dailyRentRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255},
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  daeReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

const Rental = mongoose.model('Rental', rentalSchema);

/**
 * determine if an object is a valid rental
 * @param {*} rental rental
 * @return {Object} object
 */
function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };
  return Joi.validate(rental, schema);
}
exports.Rental = Rental;
exports.validate = validateRental;
