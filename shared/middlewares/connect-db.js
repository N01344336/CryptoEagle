const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;

async function connectDB() {
    try {
        await mongoose.connect(DB_URL, { dbName: DB_NAME });
        console.log("Database Connected");
        return mongoose.connection;
    } catch (err) {
        console.error("Database failed to connect", err.message);
        throw err;

    }
}

module.exports = connectDB;