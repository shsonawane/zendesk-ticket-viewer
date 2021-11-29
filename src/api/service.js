const request = require("../util/request")
const config = require("../config/zendesk");

/**
 * API to fetch ticket list from zendesk.
 * 
 * @param {import("winston").Logger} logger         winston logger object. 
 * @returns {import("connect").SimpleHandleFunction} express simple response handler function.
 */
let list = function (logger) {
  return async function (req, res, next) {
    try {
      logger.debug("Inside ticket list API handler");
      let response = await request(config.url.requestList, logger);
      res.status(200);
      res.json({
        data: response.requests.map(item => {
          return {
            "id": item.id,
            "status": item.status,
            "subject": item.subject,
            "description": item.description,
            "created_at": new Date(item.created_at).toLocaleDateString()
              + " " + new Date(item.created_at).toLocaleTimeString(),
            "updated_at": new Date(item.updated_at).toLocaleDateString()
              + " " + new Date(item.updated_at).toLocaleTimeString(),
          }
        })
      });
    } catch (e) {
      next(e);
    }
  };
}

/**
 * API to fetch ticket by id from zendesk.
 * 
 * @param {import("winston").Logger} logger         winston logger object. 
 * @returns {import("connect").NextHandleFunction} express simple response handler function.
 */
let ticket = function (logger) {
  return async function (req, res, next) {
    try {
      logger.debug("Inside ticket API handler");
      var id = req.params.id;
      if (isNaN(id)) {
        res.status(400);
        next(new Error(`Request ID is invalid.`));
      }
      let response = await request(config.url.requestById(id), logger);
      res.status(200);
      res.json(response);
    } catch (error) {
      if (error.response) {
        let errorResponse = error.response;
        res.status(errorResponse.status);
        let errorMessage = errorResponse.data && errorResponse.data.description
          ? errorResponse.data.description : "Something went wrong";
        if (errorResponse.data && errorResponse.data.error
          && errorResponse.data.error === "RecordNotFound") {
          errorMessage = "Record not found for id: " + id;
        }
        error = new Error(errorMessage);
      }
      next(error);
    }
  };
}

module.exports = {
  list,
  ticket
}