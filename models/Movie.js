const mongoose = require('mongoose');
const {genreSchema} = require('./Genre');
const Joi = require('joi');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 255},
  genre: {
    type: genreSchema,
    required: true},
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255},
  dailyRentRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255},
});

const Movie = mongoose.model('Movie', movieSchema);

/**
 * determine if an object is a valid movie
 * @param {*} movie movie
 * @return {Object} object
 */
function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(1).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(1).max(255).required(),
    dailyRentRate: Joi.number().min(1).max(255).required(),
  };
  return Joi.validate(movie, schema);
}
exports.Movie = Movie;
exports.validate = validateMovie;
