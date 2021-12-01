const axios = require('axios');
const zendesk = require('../config/zendesk');
const credentials = require('../config/credentials');

/**
 * API helper function. Helper will retry API call as per count.
 * @param {string} url                      API url.
 * @param {import("winston").Logger} logger winston logger object.
 * @param {number} retryCount               API error retry count - default = 3
 * @returns {JSON}                          Returns api response object.
 *                                          Throws exception on API error.
 */
async function request(url, logger, retryCount = 3) {
  try {
    logger.debug(`Inside API request, RetryCount : ${retryCount}`);
    let cred = `${credentials.emailId}:${credentials.password}`;
    if (process.env.CRED) {
      cred = process.env.CRED;
    }
    const token = Buffer.from(cred).toString('base64');
    const response = await axios.get(
      zendesk.host + url,
      {
        headers: { Authorization: `Basic ${token}` },
      },
    );
    logger.debug('Zendesk API response received.');
    return response.data;
  } catch (error) {
    if (error.response && error.response.status < 500 && retryCount > 1) {
      return request(url, logger, retryCount - 1);
    }
    throw error;
  }
}

module.exports = {
  request,
};
