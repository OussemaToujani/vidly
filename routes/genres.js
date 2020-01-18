const express = require('express');
const {Genre, validate} = require('../models/Genre');
const router = new express.Router();
const debug = require('debug')('app:genre');

router.get('/', async (req, res) => {
  await Genre.find()
      .then((genres) => res.status(200).send(JSON.stringify(genres)))
      .catch((err) => res.status(500).send(err));
});


router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id)
      .catch((err) => res.status(500).send(err));

  if (genre) {
    res.status(200).end(JSON.stringify(genre));
  } else {
    res.status(404).end('No genre was found with the given id');
  }
});


router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = new Genre(req.body);
  await genre.save()
      .then((genre) => res.status(200).send(JSON.stringify(genre)))
      .catch((err) => res.status(500).send(err));
});


router.put('/:id', async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    new: true,
  }).catch((err) => res.status(500).send(err));

  if (genre) {
    res.status(200).send(JSON.stringify(genre));
  } else {
    res.status(404).send('no genre with the provided id exists');
  }
});


router.delete('/:id', async (req, res) => {
  const genre = Genre.findByIdAndRemove(req.params.id)
      .catch((err) => res.status(500).send(err));

  if (genre) {
    res.status(200).send(JSON.stringify(genre));
  } else {
    res.status(404).send('no genre with the provided id exists');
  }
});

module.exports = router;
