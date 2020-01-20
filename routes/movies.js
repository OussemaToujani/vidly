const express = require('express');
const router = new express.Router();
const {Movie, validate} = require('../models/Movie');
const {Genre} = require('../models/Genre');
const auth = require('../middleware/auth');
const asyncWrapper = require('../middleware/async');
const debug = require('debug')('app:movie');


router.get('/', asyncWrapper(async (req, res) => {
  const movies = await Movie.find();
  return res.status(200).send(JSON.stringify(movies));
}));


router.get('/:id', asyncWrapper(async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (movie) {
    res.status(200).end(JSON.stringify(movie));
  } else {
    res.status(404).end('No movie was found with the given id');
  }
}));


router.post('/', auth, asyncWrapper(async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre');

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name},
    numberInStock: req.body.numberInStock,
    dailyRentRate: req.body.dailyRentRate});

  await movie.save();
  return res.status(200).send(JSON.stringify(movie));
}));


router.put('/:id', auth, asyncWrapper(async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre');

  const movie = await Movie.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name},
    numberInStock: req.body.numberInStock,
    dailyRentRate: req.body.dailyRentRate,
    new: true});

  if (movie) {
    res.status(200).send(JSON.stringify(movie));
  } else {
    res.status(404).send('no movie with the provided id exists');
  }
}));


router.delete('/:id', auth, asyncWrapper(async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (movie) {
    res.status(200).send(JSON.stringify(movie));
  } else {
    res.status(404).send('no movie with the provided id exists');
  }
}));

module.exports = router;
