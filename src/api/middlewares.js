/**
 * Middleware to handle 404 error response.
 *
 * @returns {import("connect").NextHandleFunction} express 404 handler function.
 */
const notFound = () => (req, res, next) => {
  res.status(404);
  next(new Error(`Not Found: ${req.originalUrl}`));
};

/**
 * Middleware to handle error response. Error messages are displayed as they are to the user
 * in response except for 500 errors which are displayed as 'Server Error'.
 *
 * @param {import("winston").Logger} logger         winston logger object.
 * @returns {import("connect").ErrorHandleFunction} express error handler function.
 */
function errorHandler(logger) {
  return (err, req, res) => {
    logger.error(err);
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.send(res.statusCode >= 500 ? 'Server Error' : err.message);
  };
}

module.exports = {
  notFound,
  errorHandler,
};
