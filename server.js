const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Handling synchronous errors 
process.on("uncaughtException", (err) => {
    console.log(err.name, err.message);
    console.log("Unhandled rejection! Shutting down!");
    //   Code 1 stands for uncaught exception
    process.exit(1);
});

dotenv.config();

const app = require('./app');

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD.replace("@", "%40"));

mongoose.connect(DB, {
    autoCreate: true,
    autoIndex: true
}).then(conn => console.log("Database connection successful!")).catch(err => console.log("Error connecting to the database! ", err))

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log("App running on port ", port);
})

// Handling Async errors
process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("Unhandled rejection! Shutting down!");
    server.close(() => {
        //   Code 1 stands for uncaught exception
        process.exit(1);
    });
});