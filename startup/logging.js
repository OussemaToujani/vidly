const winston = require('winston');
require('winston-mongodb');

module.exports = function() {
  winston.add(
      new winston.transports.File({filename: 'vidly.log', level: 'info'}),
  );

  process.on('uncaughtException', (ex) => {
    debug('Uncaught Exception!');
    debug(ex);
    winston.error(ex.message, ex);
    process.exit(1);
  });

  process.on('unhandledRejection', (ex) => {
    debug('Unhandled Rejection!');
    winston.error(ex.message, ex);
    process.exit(1);
  });
};
