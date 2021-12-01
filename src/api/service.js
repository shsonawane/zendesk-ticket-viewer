const { request } = require('../util/request');
const config = require('../config/zendesk');

/**
 * API to fetch ticket list from zendesk.
 *
 * @param {import("winston").Logger} logger        winston logger object.
 * @returns {import("connect").NextHandleFunction} express next response handler function.
 */
function list(logger) {
  return async (req, res, next) => {
    try {
      logger.debug('Inside ticket list API handler');
      const response = await request(config.url.requestList, logger);
      res.status(200);
      res.json({
        data: response.requests.map((item) => ({
          id: item.id,
          status: item.status,
          subject: item.subject,
          description: item.description,
          created_at: `${new Date(item.created_at).toLocaleDateString()} ${new Date(item.created_at).toLocaleTimeString()}`,
          updated_at: `${new Date(item.updated_at).toLocaleDateString()} ${new Date(item.updated_at).toLocaleTimeString()}`,
        })),
      });
    } catch (e) {
      let error = e;
      if (error.response) {
        const errorResponse = error.response;
        res.status(errorResponse.status);
        const errorMessage = errorResponse.data && errorResponse.data.description
          ? errorResponse.data.description : errorResponse.statusText;
        error = new Error(errorMessage);
      }
      next(error);
    }
  };
}

/**
 * API to fetch ticket by id from zendesk.
 *
 * @param {import("winston").Logger} logger         winston logger object.
 * @returns {import("connect").NextHandleFunction} express simple response handler function.
 */
function ticket(logger) {
  return async (req, res, next) => {
    const { id } = req.params;
    try {
      logger.debug('Inside ticket API handler');
      if (Number.isNaN(id)) {
        res.status(400);
        next(new Error('Request ID is invalid.'));
        return;
      }
      const response = await request(config.url.requestById(id), logger);
      res.status(200);
      const item = response.request;
      res.json({
        id: item.id,
        status: item.status,
        subject: item.subject,
        description: item.description,
        created_at: `${new Date(item.created_at).toLocaleDateString()} ${new Date(item.created_at).toLocaleTimeString()}`,
        updated_at: `${new Date(item.updated_at).toLocaleDateString()} ${new Date(item.updated_at).toLocaleTimeString()}`,
      });
    } catch (e) {
      let error = e;
      if (error.response) {
        const errorResponse = error.response;
        res.status(errorResponse.status);
        let errorMessage = errorResponse.data && errorResponse.data.description
          ? errorResponse.data.description : errorResponse.statusText;
        if (errorResponse.data && errorResponse.data.error
            && errorResponse.data.error === 'RecordNotFound') {
          errorMessage = `Record not found for id: ${id}`;
        }
        error = new Error(errorMessage);
      }
      next(error);
    }
  };
}

module.exports = {
  list,
  ticket,
};
