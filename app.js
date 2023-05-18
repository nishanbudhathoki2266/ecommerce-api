const express = require('express');

const userRouter = require('./routes/userRoutes');

const app = express();

// JSON parser middleware with size limit of 10kb
app.use(express.json({ limit: '10kb' }));


// middlewares for serving static files
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/users', userRouter);


module.exports = app;