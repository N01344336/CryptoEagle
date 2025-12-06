const express = require('express');
const router = express.Router();
const cryptoModel = require("../models/cryptoModel");
const { validateCreateCrypto, validateUpdateCrypto, validateId } = require("../middlewares/cryptoValidation");

router.get('/', async (req, res) => {
    try {
        const currencies = await cryptoModel.getAllCrypto(req.query);

        res.status(200).json({
            message: "Cryptocurrencies retrieved successfully",
            ...currencies
        });
    } catch (err) {
        res.status(500).json({
            message: "Error retrieving cryptocurrencies",
            error: err.message
        });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const stats = await cryptoModel.getStates();

        res.status(200).json({
            message: 'Statistics have been retrieved',
            data: stats
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error retrieving statistics',
            error: err.message
        });
    }
});

router.get('/:id', validateId, async (req, res) => {
    try {
        const crypto = await cryptoModel.getCrypto(req.params.id);

        res.status(200).json({
            message: 'CryptoCurrency Found!',
            data: crypto
        });
    } catch (err) {
        if (err.message === 'Cryptocurrency not found' || err.message === 'Invalid cryptocurrency ID') {
            return res.status(404).json({
                message: err.message
            });
        }

        res.status(500).json({
            message: 'Error retrieving cryptocurrency',
            error: err.message
        });
    }
});

router.post('/', validateCreateCrypto, async (req, res) => {
    try {
        const newCrypto = await cryptoModel.addCrypto(req.body);

        res.status(201).json({
            message: 'Cryptocurrency creation successful!',
            data: newCrypto
        });
    } catch (err) {
        if (err.message === 'Cryptocurrency with this symbol already exists') {
            return res.status(400).json({
                message: err.message
            });
        }
        res.status(500).json({
            message: 'Error creating cryptocurrency',
            error: err.message
        });
    }
});

router.put('/:id', validateUpdateCrypto, async (req, res) => {
    try {
        const updateCrypto = await cryptoModel.updateCrypto(req.params.id, req.body);

        res.status(200).json({
            message: 'Cryptocurrency has been updated!',
            data: updateCrypto
        });
    } catch (err) {
        if (err.message === 'Cryptocurrency not found' || err.message === 'Invalid cryptocurrency ID') {
            return res.status(404).json({
                message: err.message
            });
        }

        res.status(500).json({
            message: 'Error updating cryptocurrency',
            error: err.message
        });
    }
});

router.delete('/:id', validateId, async (req, res) => {
    try {
        const deleteCrypto = await cryptoModel.deleteCrypto(req.params.id);

        res.status(200).json({
            message: 'Cryptocurrency has been deleted successfully',
            data: deleteCrypto
        });
    } catch (err) {
        if (err.message === 'Cryptocurrency not found' || err.message === 'Invalid cryptocurrency ID') {
            return res.status(404).json({
                message: err.message
            });
        }

        res.status(500).json({
            message: 'Error deleting cryptocurrency',
            error: err.message
        });
    }
});

module.exports = router;