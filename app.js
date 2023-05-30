const express = require('express');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const bannerRouter = require('./routes/bannerRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const brandRouter = require('./routes/brandRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const userRouter = require('./routes/userRoutes');



const app = express();

// JSON parser middleware with size limit of 10kb
app.use(express.json({ limit: '10kb' }));


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