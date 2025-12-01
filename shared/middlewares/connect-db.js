const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL;

async function connectDB(req, res, next) {
    try {
        await mongoose.connect(DB_URL, { dbName: "CryptoCurrencies" });
        console.log("Database Connected");
        next();
    } catch (err) {
        console.log("Database failed to connect");
        console.log(err);

    }
}

module.exports = connectDB;