const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = new express.Router();
const {User, validate} = require('../models/User');
const auth = require('../middleware/auth');
const asyncWrapper = require('../middleware/async');
const debug = require('debug')('app:user');


router.get('/me', auth, asyncWrapper(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  return res.status(200).send(user);
}));

router.post('/', asyncWrapper(async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if (user) {
    return res.status(400).send('A user is already registered with this email');
  }

  user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user = await user.save();
  return res.header('x-auth-token', user.generateAuthToken())
      .status(200)
      .send(JSON.stringify(_.pick(user, ['_id', 'name', 'email'])));
}));

module.exports = router;
