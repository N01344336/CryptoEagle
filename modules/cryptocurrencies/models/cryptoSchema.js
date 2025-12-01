const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    current_price: {
        type: Number,
        required: [true, 'Current price is required'],
        min: [0, 'Price cannot be negative']
    },
    market_cap: {
        type: Number,
        required: [true, 'Market cap is required'],
        min: [0, 'Market cap cannot be negative']
    },
    category: {
        type: String,
        enum: ['coin', 'token', 'stablecoin', 'meme'],
        default: 'coin'
    }
});

cryptoSchema.pre('save', function (next) {
    this.last_updated = new Date();
    next();
});

const Crypto = mongoose.model('Crypto', cryptoSchema);
module.exports = Crypto;