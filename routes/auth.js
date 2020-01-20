const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const router = new express.Router();
const {User} = require('../models/User');
const debug = require('debug')('app:auth');


router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({email: req.body.email});
  if (!user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (validPassword) {
    res.status(200).send(user.generateAuthToken());
  } else res.status(500).send('Invalid email or password');
});

/**
 * determine if an object is a valid req
 * @param {*} req req
 * @return {Object} object
 */
function validate(req) {
  const schema = {
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(8).max(255).required(),
  };
  return Joi.validate(req, schema);
}

module.exports = router;
