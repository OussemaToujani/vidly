const express = require('express');
const app = express();
require('./startup/logging');
require('./startup/config')();
require('./startup/db')();
require('./startup/routes')(app);
const morgan = require('morgan');
const debug = require('debug')('app');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

debug('Application Name: ' + config.get('applicationName'));
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', './views');


if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan enabled..');
}


app.listen(port, () => {
  debug(`listening on port ${port}...`);
});
