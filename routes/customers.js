const express = require('express');
const router = new express.Router();
const {Customer, validate} = require('../models/Customer');
const auth = require('../middleware/auth');
const asyncWrapper = require('../middleware/async');
const debug = require('debug')('app:customer');

router.get('/', auth, asyncWrapper(async (req, res) => {
  const customers = await Customer.find();
  return res.status(200).send(JSON.stringify(customers));
}));


router.get('/:id', auth, asyncWrapper(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (customer) {
    res.status(200).end(JSON.stringify(customer));
  } else {
    res.status(404).end('No customer was found with the given id');
  }
}));


router.post('/', auth, asyncWrapper(async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer(req.body);
  customer = await customer.save()
  return res.status(200).send(JSON.stringify(customer));
}));


router.put('/:id', auth, asyncWrapper(async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    isGold: req.body.isGold,
    phoneNumber: req.body.phoneNumber,
    new: true,
  });

  if (customer) {
    res.status(200).send(JSON.stringify(customer));
  } else {
    res.status(404).send('no customer with the provided id exists');
  }
}));


router.delete('/:id', auth, asyncWrapper(async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (customer) {
    res.status(200).send(JSON.stringify(customer));
  } else {
    res.status(404).send('no customer with the provided id exists');
  }
}));

module.exports = router;
