const express = require('express');
const server = express();
const cryptoRoutes = require('./routes/cryptoRoutes');

const PORT = 3000;
const hostname = "localhost";

server.use(express.json());
server.use(express.urlencoded({ extended: true }))
server.use(cryptoRoutes);

function errorHandler(err, req, res, next) {
    console.log(err.message)
    res.status(500).send(err.message)
}
server.use(errorHandler)
server.use((req, res, next) => {
    res.status(404).send(`404! ${req.method} ${req.path} NotFound.`);
});

server.listen(PORT, hostname, (error) => {
    if (error) console.log(error.message);
    else console.log(`Server is running on http://localhost:${PORT}`);
});