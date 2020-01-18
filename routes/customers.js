const express = require('express');
const {Customer, validate} = require('../models/Customer');
const router = new express.Router();
const debug = require('debug')('app:customer');

router.get('/', async (req, res) => {
  await Customer.find()
      .then((customers) => res.status(200).send(JSON.stringify(customers)))
      .catch((err) => res.status(500).send(err));
});


router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id)
      .catch((err) => res.status(500).send(err));

  if (customer) {
    res.status(200).end(JSON.stringify(customer));
  } else {
    res.status(404).end('No customer was found with the given id');
  }
});


router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer(req.body);
  await customer.save()
      .then((customer) => res.status(200).send(JSON.stringify(customer)))
      .catch((err) => res.status(500).send(err));
});


router.put('/:id', async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    isGold: req.body.isGold,
    phoneNumber: req.body.phoneNumber,
    new: true,
  }).catch((err) => res.status(500).send(err));

  if (customer) {
    res.status(200).send(JSON.stringify(customer));
  } else {
    res.status(404).send('no customer with the provided id exists');
  }
});


router.delete('/:id', async (req, res) => {
  const customer = Customer.findByIdAndRemove(req.params.id)
      .catch((err) => res.status(500).send(err));

  if (customer) {
    res.status(200).send(JSON.stringify(customer));
  } else {
    res.status(404).send('no customer with the provided id exists');
  }
});

module.exports = router;
