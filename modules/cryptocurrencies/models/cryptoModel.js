const Crypto = require("./cryptoSchema");

const getAllCrypto = async (queryParams = {}) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = "market_cap",
            order = "desc",
            search,
            minPrice,
            maxPrice,
            category
        } = queryParams;

        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { symbol: { $regex: search, $options: 'i' } }
            ];
        }

        if (minPrice || maxPrice) {
            query.current_price = {};
            if (minPrice) query.current_price.$gte = parseFloat(minPrice);
            if (maxPrice) query.current_price.$lte = parseFloat(maxPrice);
        }

        if (category) {
            query.category = category;
        }

        const skip = (page - 1) * limit;

        const sort = {};
        sort[sortBy] = order === 'asc' ? 1 : -1;

        const cryptos = await Crypto.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Crypto.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        return {
            data: cryptos,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: total,
                itemsPerPage: parseInt(limit),
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };

    } catch (err) {
        throw new Error(`There was an error fetching cryptocurrencies: ${err.message}`);
    }
};

const getCrypto = async (id) => {
    try {
        const crypto = await Crypto.findById(id);

        if (!crypto) {
            throw new Error('Cryptocurrency not found');
        }

        return crypto;
    } catch (err) {
        throw new Error(`Error fetching cryptocurrency: ${err.message}`);
    }
};

const getCryptoBySymbol = async (symbol) => {
    try {
        const crypto = await Crypto.findOne({ symbol: symbol.toUpperCase() });
        return crypto;
    } catch (err) {
        throw new Error(`Error fetching cryptocurrency by symbol: ${err.message}`);
    }
};

const addCrypto = async (cryptoData) => {
    try {
        const newCrypto = new Crypto(cryptoData);
        await newCrypto.save();

        return newCrypto;
    } catch (err) {
        throw new Error(`Error creating cryptocurrency: ${err.message}`);
    }
};

const updateCrypto = async (id, updateData) => {
    try {
        delete updateData.symbol;
        const updateCrypto = await Crypto.findByIdAndUpdate(
            id,
            { ...updateData, },
            { new: true, runValidators: true }
        );

        if (!updateCrypto) {
            throw new Error('Cryptocurrency not found');
        }

        return updateCrypto;
    } catch (err) {
        throw new Error(`Error updating cryptocurrency: ${err.message}`);
    }
};

const deleteCrypto = async (id) => {
    try {
        const deleteCrypto = await Crypto.findByIdAndDelete(id);

        if (!deleteCrypto) {
            throw new Error('Cryptocurrency not found');
        }

        return deleteCrypto;
    } catch (err) {
        throw new Error(`Error deleting cryptocurrency: ${err.message}`);
    }
};

const getStates = async () => {
    try {
        const stats = await Crypto.aggregate([
            {
                $group: {
                    _id: null,
                    totalCryptos: { $sum: 1 },
                    averagePrice: { $avg: '$current_price' },
                    totalMarketCap: { $sum: '$market_cap' },
                    highestPrice: { $max: '$current_price' },
                    lowestPrice: { $min: '$current_price' }
                }
            }
        ]);

        return stats[0] || {};
    } catch (err) {
        throw new Error(`Error getting statistics: ${err.message}`);
    }
};

module.exports = {
    getAllCrypto,
    getCrypto,
    getCryptoBySymbol,
    addCrypto,
    updateCrypto,
    deleteCrypto,
    getStates
};