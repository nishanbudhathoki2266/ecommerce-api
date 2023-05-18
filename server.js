const mongoose = require('mongoose');
const dotenv = require('dotenv');

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