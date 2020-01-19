const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
});

const Genre = mongoose.model('Genre', genreSchema);

/**
 * determine if an object is a valid genre
 * @param {*} genre genre
 * @return {Object} object
 */
function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(1).max(255).required(),
  };
  return Joi.validate(genre, schema);
}
exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;
