const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  // organization: process.env.OPENAI_ORGANIZATION,
});

const openai = new OpenAIApi(configuration);

module.exports = openai;
