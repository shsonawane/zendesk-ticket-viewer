const axios = require("axios");

/**
 * Private api helper function. Helper will retry API call as per count.
 * 
 * @param {number} retryCount   API error retry count - default = 3 
 * @returns {any}
 */
const _apiRequest = async function (method, url, body, retryCount = 3) {
    try {
        let response = await axios({
            method: method,
            url: url,
            data: body
        });
        return response.data;
    } catch (error) {
        if (retryCount <= 0) {
            throw error;
        } else {
            retryCount--;
            _apiRequest(retryCount);
        }
    }
}


const getTickets= async function() {

}

module.exports = {

}