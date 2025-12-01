require("dotenv").config();
const express = require('express');
const server = express();
const cryptoModel = require('./modules/cryptocurrencies/models/cryptoModel');
const cryptoRoutes = require('./routes/cryptoRoutes');
const connectDB = require('./shared/middlewares/connect-db');

const PORT = process.env.PORT;
const hostname = "localhost";

server.use(connectDB);
server.use(express.json());
server.use(express.urlencoded({ extended: true }))
server.use('/api/cryptos', cryptoRoutes);

function errorHandler(err, req, res, next) {
    console.log(err.message)
    res.status(500).send("Internal server error: ", err.message)
}

server.use(errorHandler)
server.use((req, res, next) => {
    res.status(404).send(`404! ${req.method} ${req.path} Not Found.`);
});

server.listen(PORT, hostname, (error) => {
    if (error) console.log(error.message);
    else console.log(`Server is running on http://${hostname}:${PORT}`);
});