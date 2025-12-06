require("dotenv").config();
const express = require('express');
const server = express();
const cryptoRoutes = require('./modules/cryptocurrencies/routes/cryptoRoutes');
const connectDB = require('./shared/middlewares/connect-db');

const PORT = process.env.PORT || 3000;
const hostname = "0.0.0.0";

server.use(express.json());
server.use(express.urlencoded({ extended: true }))

server.use('/api/cryptos', cryptoRoutes);

server.get('/', (req, res) => {
    res.json({
        message: 'Crypto Eagle',
        database: 'MonogoDB',
        status: 'Running'
    });
});

server.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        method: req.method,
        path: req.path
    });
});

server.use((err, req, res, next) => {
    console.error('Server Error', err.message);
    res.status(500).json({
        message: 'Internal server error',
        error: err.message
    });
});

async function startServer() {
    try {
        await connectDB();
        console.log('MOngoDB is connected!');

        server.listen(PORT, hostname, (error) => {
            if (error) console.log(error.message);
            else console.log(`Server is running on http://${hostname}:${PORT}`);
        });
    } catch (err) {
        console.err('Failed to start server: ', err.message);
    }
}

startServer();