/**
 * API to fetch ticket list from zendesk.
 * 
 * @param {import("winston").Logger} logger         winston logger object. 
 * @returns {import("connect").SimpleHandleFunction} express simple response handler function.
 */
module.exports = function(logger) {
  return function (req, res) {
    logger.debug("Inside ticket API handler");
    res.json({
      message: "Getting started!"
    });
  };  
}