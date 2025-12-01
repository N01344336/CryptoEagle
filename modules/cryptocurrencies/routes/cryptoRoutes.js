const express = require('express');
const { Router } = express.Router();
const cryptoModel = require("../models/cryptoModel");
const { validateCreateCrypto, validateupdateCrypto } = require("../middlewares/cryptoValidation");
const { Router } = require('express-validator');

const cryptoeagle = Router();

cryptoeagle.get('/', async (req, res) => {
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