/**
 * middleware functin for logging
 * @param {*} req request
 * @param {*} res response
 * @param {*} next next function in the request processing pipeline
 */
function log(req, res, next) {
  console.log('Logging...');
  next();
}

module.exports = log;
