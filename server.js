const http = require('http');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app');
const server = http.createServer(app);

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception!! Shutting Down');
  console.log({ name: err.name, message: err.message });
  process.exit(1);
});

const DB = process.env.DATABASE_CLOUD;
// const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connection successful');
  });

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!! Closing Server then shutting down');
  console.log({ name: err.name, message: err.message });
  server.close(() => {
    process.exit(1);
  });
});
