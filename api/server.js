const serverless = require('serverless-http');
const app = require('../app');
const connectDB = require('../db/connect');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await connectDB(process.env.MONGO_URI);
    isConnected = true;
  }
  const handler = serverless(app);
  return handler(req, res);
};
