const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const {User, validate} = require('../models/User');
const router = new express.Router();
const debug = require('debug')('app:user');


router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  debug(user);
  if (user) {
    return res.status(400).send('A user is already registered with this email');
  }

  user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save()
      .then((user) => res.status(200).send(JSON.stringify(
          _.pick(user, ['_id', 'name', 'email'])),
      ))
      .catch((err) => res.status(500).send(err));
});

module.exports = router;
