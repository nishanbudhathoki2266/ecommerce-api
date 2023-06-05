const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const bannerRouter = require('./routes/bannerRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const brandRouter = require('./routes/brandRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Helmet
app.use(helmet());

// JSON parser middleware with size limit of 10kb
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
})

// Rate Limiter
app.use('/api', limiter);

// Data Sanitization against NoSql query injection
app.use(mongoSanitize());

// Data sanitizaiton against xss
app.use(xss());

// Avoiding parameter pollution: Must be used in last because it clears query string
app.use(hpp({
    whitelist: ['price', 'ratingsQuantity', 'ratingsAverage']
}))

// middlewares for serving static files
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/banners', bannerRouter);
app.use('/api/v1/brands', brandRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/users', userRouter);

app.use('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler);

module.exports = app;