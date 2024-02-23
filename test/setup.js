const { MongoMemoryServer } = require('mongodb-memory-server');

const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config({ path: './config.env' });

const app = express();

const User = require('../models/userModel');

const payload = require('../test/payloads/user.payload');

app.use(express.json());

// ROUTES
const userRouter = require('../routes/userRoutes');
const subscriptionRouter = require('../routes/subscriptionRoutes');
const referralRouter = require('../routes/referralsRoutes');

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/referrals', referralRouter);

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri);
  await User.create(payload);
});

afterAll(async () => await mongo.stop());

module.exports = app;
