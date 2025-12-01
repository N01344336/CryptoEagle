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

        if (category) {
            query.category = category;
        }

        const skip = (page - 1) * limit;

        const sort = {};
        sort[sortBy] = order === 'asc' ? 1 : -1;

        const cryptos = await Crypto.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parse(limit));

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

const addCrypto = async (cryptoData) => {
    try {
        const newCrypto = new Crypto(cryptoData);
        await newCrypto.save();

        return newCrypto;
    } catch (err) {
        throw new Error(`Error creating cryptocurrency: ${error.message}`);
    }
};

const updateCrypto = async (id, updateData) => {
    try {
        const updateCrypto = await Crypto.findByIdAndUpdate(
            id,
            { ...updateData, last_updated: new Date() },
            { new: true, runValidators: true }
        );

        if (!updateCrypto) {
            throw new Error('Cryptocurrency not found');
        }

        return updateCrypto;
    } catch (err) {
        throw new Error(`Error updating cryptocurrency: ${error.message}`);
    }
};

const deleteCrypto = async (id) => {
    try {
        const deleteCrypto = await Crypto.findByIdAndDelete(id);

        if (!deletedCrypto) {
            throw new Error('Cryptocurrency not found');
        }

        return deletedCrypto;
    } catch (err) {
        throw new Error(`Error deleting cryptocurrency: ${error.message}`);
    }
}

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
        throw new Error(`Error getting statistics: ${error.message}`);
    }
};

module.exports = {
    getAllCrypto,
    getCrypto,
    addCrypto,
    updateCrypto,
    deleteCrypto,
    getStates
};