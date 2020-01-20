const express = require('express');
const router = new express.Router();
const {Genre, validate} = require('../models/Genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncWrapper = require('../middleware/async');
const debug = require('debug')('app:genre');


router.get('/', asyncWrapper(async (req, res) => {
  const genres = await Genre.find();
  return res.status(200).send(JSON.stringify(genres));
}));


router.get('/:id', asyncWrapper(async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (genre) {
    res.status(200).end(JSON.stringify(genre));
  } else {
    res.status(404).end('No genre was found with the given id');
  }
}));


router.post('/', auth, asyncWrapper(async (req, res) => {
  const {error} = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let genre = new Genre(req.body);
  genre = await genre.save();
  return res.status(200).send(JSON.stringify(genre));
}));


router.put('/:id', auth, asyncWrapper(async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    new: true,
  });

  if (genre) {
    res.status(200).send(JSON.stringify(genre));
  } else {
    res.status(404).send('no genre with the provided id exists');
  }
}));


router.delete('/:id', [auth, admin], asyncWrapper(async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (genre) {
    res.status(200).send(JSON.stringify(genre));
  } else {
    res.status(404).send('no genre with the provided id exists');
  }
}));

module.exports = router;
