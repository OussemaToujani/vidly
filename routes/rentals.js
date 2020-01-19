const express = require('express');
const {Rental, validate} = require('../models/Rental');
const {Movie} = require('../models/Movie');
const {Customer} = require('../models/Customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const router = new express.Router();
const debug = require('debug')('app:movie');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
  await Rental.find().sort('-dateOut')
      .then((rentals) => res.status(200).send(JSON.stringify(rentals)))
      .catch((err) => res.status(500).send(err));
});


router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id)
      .catch((err) => res.status(500).send(err));

  if (rental) {
    res.status(200).end(JSON.stringify(rental));
  } else {
    res.status(404).end('No rental was found with the given id');
  }
});


router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie');

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phoneNumber: customer.phoneNumber},
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentRate: movie.dailyRentRate},
  });

  try {
    new Fawn.Task()
        .save('rentals', rental)
        .update('movies', {_id: movie._id}, {
          $inc: {numberInStock: -1}}).run();

    res.status(200).send(JSON.stringify(rental));
  } catch (e) {
    res.status(500).send('Internal server error!');
  }
});


router.put('/:id', async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie');

  const rental = await Rental.findByIdAndUpdate(req.params.id, {
    customer: {
      _id: customer._id,
      name: customer.name,
      phoneNumber: customer.phoneNumber},
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentRate: movie.dailyRentRate},
    new: true}).catch((err) => res.status(500).send(err));

  if (rental) {
    res.status(200).send(JSON.stringify(rental));
  } else {
    res.status(404).send('no rental with the provided id exists');
  }
});


router.delete('/:id', async (req, res) => {
  const rental = Rental.findByIdAndRemove(req.params.id)
      .catch((err) => res.status(500).send(err));

  if (rental) {
    res.status(200).send(JSON.stringify(rental));
  } else {
    res.status(404).send('no rental with the provided id exists');
  }
});

module.exports = router;
