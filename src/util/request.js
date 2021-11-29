const axios = require("axios");
const config = require("../config/zendesk");

/**
 * API helper function. Helper will retry API call as per count.
 * 
 * @param {number} retryCount   API error retry count - default = 3 
 * @param {logger}
 * @returns {any}
 */
const apiRequest = async function (url, logger, retryCount = 3) {
    try {
        logger.debug("Inside API request, RetryCount : " + retryCount);
        let response = await axios.get(
            config.host + url,
            {
                headers: { "Authorization": `${config.token}` }
            }
        );
        logger.debug("Zendesk API response received.");
        return response.data;
    } catch (error) {
        retryCount--;
        logger.error(JSON.stringify(error.response.data));
        if (error.response.status < 500 || retryCount <= 0) {
            throw error;
        } else {
            return apiRequest(url, logger, retryCount);
        }
    }
}

module.exports = apiRequest;