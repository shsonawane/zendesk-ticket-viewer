module.exports = {
  host: 'https://zccsonawane.zendesk.com',
  url: {
    requestList: '/api/v2/requests.json',
    requestById: (id) => `/api/v2/requests/${id}.json`,
  },
};
