const express = require('express');
const {Movie, validate} = require('../models/Movie');
const {Genre} = require('../models/Genre');
const router = new express.Router();
const debug = require('debug')('app:movie');

router.get('/', async (req, res) => {
  await Movie.find()
      .then((movies) => res.status(200).send(JSON.stringify(movies)))
      .catch((err) => res.status(500).send(err));
});


router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id)
      .catch((err) => res.status(500).send(err));

  if (movie) {
    res.status(200).end(JSON.stringify(movie));
  } else {
    res.status(404).end('No movie was found with the given id');
  }
});


router.post('/', async (req, res) => {
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

  await movie.save()
      .then((movie) => res.status(200).send(JSON.stringify(movie)))
      .catch((err) => res.status(500).send(err));
});


router.put('/:id', async (req, res) => {
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
    new: true}).catch((err) => res.status(500).send(err));

  if (movie) {
    res.status(200).send(JSON.stringify(movie));
  } else {
    res.status(404).send('no movie with the provided id exists');
  }
});


router.delete('/:id', async (req, res) => {
  const movie = Movie.findByIdAndRemove(req.params.id)
      .catch((err) => res.status(500).send(err));

  if (movie) {
    res.status(200).send(JSON.stringify(movie));
  } else {
    res.status(404).send('no movie with the provided id exists');
  }
});

module.exports = router;
