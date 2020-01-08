const express = require('express');
const morgan = require('morgan');
const config = require('config');
const debug = require('debug')('app');
const logger = require('./logger');
const home = require('./routes/home');
const genres = require('./routes/genres');
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(logger);


// Configuration
debug('Application Name: ' + config.get('applicationName'));
const port = process.env.PORT || 3000;
app.set('view engine', 'pug');
app.set('views', './views');

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan enabled..');
}

app.use('/', home);
app.use('/api/genres', genres);

app.listen(port, () => {
  debug(`listening on port ${port}...`);
});
