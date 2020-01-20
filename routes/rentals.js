const express = require('express');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const router = new express.Router();
const {Rental, validate} = require('../models/Rental');
const {Movie} = require('../models/Movie');
const {Customer} = require('../models/Customer');
const auth = require('../middleware/auth');
const asyncWrapper = require('../middleware/async');
const debug = require('debug')('app:movie');

Fawn.init(mongoose);

router.get('/', asyncWrapper(async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  return res.status(200).send(JSON.stringify(rentals));
}));


router.get('/:id', asyncWrapper(async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (rental) {
    res.status(200).end(JSON.stringify(rental));
  } else {
    res.status(404).end('No rental was found with the given id');
  }
}));


router.post('/', auth, asyncWrapper(async (req, res) => {
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

  new Fawn.Task()
      .save('rentals', rental)
      .update('movies', {_id: movie._id}, {
        $inc: {numberInStock: -1}}).run();

  res.status(200).send(JSON.stringify(rental));
}));


router.put('/:id', auth, asyncWrapper(async (req, res) => {
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
    new: true});

  if (rental) {
    res.status(200).send(JSON.stringify(rental));
  } else {
    res.status(404).send('no rental with the provided id exists');
  }
}));


router.delete('/:id', auth, asyncWrapper(async (req, res) => {
  const rental = await Rental.findByIdAndRemove(req.params.id);

  if (rental) {
    res.status(200).send(JSON.stringify(rental));
  } else {
    res.status(404).send('no rental with the provided id exists');
  }
}));

module.exports = router;
