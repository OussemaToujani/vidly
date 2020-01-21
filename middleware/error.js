const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {service: 'user-service'},
  transports: [
    new winston.transports.File({filename: 'vidly.log', level: 'info'}),
  ],
});

// winston.add(new winston.transports.MongoDB({db: 'mongodb://localhost/vidly', level: 'info'}));

module.exports = function(err, req, res, next) {
  logger.error(err.message, err);
  return res.status(500).send('Internal error.');
};
