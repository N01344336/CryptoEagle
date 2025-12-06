const { body, param, validationResult } = require('express-validator');

const validateCreateCrypto = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),

    body('symbol')
        .notEmpty()
        .withMessage('Symbol is required')
        .isUppercase()
        .withMessage('Symbol must be uppercase')
        .isLength({ min: 2, max: 10 })
        .withMessage('Symbol must be between 2 and 10 characters'),

    body('current_price')
        .isFloat({ min: 0 })
        .withMessage('Current price must be a positive number'),

    body('market_cap')
        .isInt({ min: 0 })
        .withMessage('Market cap must be a positive integer'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];

const validateUpdateCrypto = [
    param('id')
        .isMongoId()
        .withMessage('Invalid cryptocurrency ID format'),

    body('current_price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Current price must be a positive number'),

    body('market_cap')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Market cap must be a positive integer'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];

const validateId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid cryptocurrency ID format'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];

module.exports = {
    validateCreateCrypto,
    validateUpdateCrypto,
    validateId
};