const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const subscriptionRouter = require('./routes/subscriptionRoutes');
const referralRouter = require('./routes/referralsRoutes');
const withdrawalRouter = require('./routes/withdrawalRoutes');
const ticketRouter = require('./routes/ticketRoutes');
const contactRouter = require('./routes/contactRoutes');

const app = express();

// 1) Global Middlewares
// This is how we use middleware (app.use)

// Set security HTTP Header (Helmet )
app.use(helmet());

// Use Mogan to log api request in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP. Please try again in an hour!',
});

// Enabling CORS
app.use(cors());

// Limit request from the same API
// app.use('/api', limiter);

// Body Parser (To parse body form the request that was made || Reading Request from the body || PUT, POST, PATCH requests)
app.use(express.json({ limit: '10mb' }));

// Data Sanitization against NOSQL Query Injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Preventing Parameter Pollution
app.use(
  hpp({
    whitelist: [],
  })
);

// Serving Static Files
// app.use(express.static(`${__dirname}/public`));

// 2) Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/referrals', referralRouter);
app.use('/api/v1/withdrawals', withdrawalRouter);
app.use('/api/v1/tickets', ticketRouter);
app.use('/api/v1/contacts', contactRouter);

app.all('*', (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);

  // The next function accepts an argument that we use as the error object
  next(err);
});

// Global Error Handling Middleware for Operational error

app.use(globalErrorHandler);

module.exports = app;
