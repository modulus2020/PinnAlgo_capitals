const axios = require('axios');

const headers = {
  'api-key': process.env.SENDINBLUE_API_KEY,
  accept: 'application/json',
  'content-type': 'application/json',
};
module.exports = axios.create({
  baseURL: 'https://api.sendinblue.com/v3',
  headers,
});
