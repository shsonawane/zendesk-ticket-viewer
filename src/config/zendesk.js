"use strict";
module.exports = {
    host: "https://zccsonawane.zendesk.com",
    token: "Basic c29uYXdhbmUuc2hAbm9ydGhlYXN0ZXJuLmVkdTowZnp3c2s3YyM5",
    url: {
        requestList: "/api/v2/requests.json",
        requestById: (id) => `/api/v2/requests/${id}.json`
    }
}