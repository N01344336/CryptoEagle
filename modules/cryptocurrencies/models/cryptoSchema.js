const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    symbol: {
        type: String,
        required: [true, 'Symbol is required'],
        uppercase: true,
        unique: true,
        trim: true,
        minlength: [2, 'Symbol must be at least 2 characters'],
        maxlength: [10, 'Symbol cannot exceed 10 characters']
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

    volume_24h: {
        type: Number,
        required: [true, '24h volume is required'],
        min: [0, 'Volume cannot be negative']
    },

    price_change_24h: {
        type: Number,
        default: 0
    },

    last_updated: {
        type: Date,
        default: Date.now
    },

    category: {
        type: String,
        enum: ['coin', 'token', 'stablecoin', 'meme'],
        default: 'coin'
    }
}, {
    timestamps: true
});

cryptoSchema.index({ name: 'text', symbol: 'text' });

const Crypto = mongoose.model('Crypto', cryptoSchema);
module.exports = Crypto;