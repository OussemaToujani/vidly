const express = require('express');
const morgan = require('morgan');
const config = require('config');
const debug = require('debug')('app');
const logger = require('./logger');
const home = require('./routes/home');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(logger);


// Configuration
debug('Application Name: ' + config.get('applicationName'));
const port = process.env.PORT || 3000;
mongoose.connect('mongodb://localhost/vidly')
    .then(() => debug('connected to the database'))
    .catch( (err) => debug('Could not connect to the database', err));
app.set('view engine', 'pug');
app.set('views', './views');


if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan enabled..');
}

app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

app.listen(port, () => {
  debug(`listening on port ${port}...`);
});
