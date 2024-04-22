
const { check } = require('express-validator')
const validatorMiddelware = require('../../middelware.js/validatorMiddelware')


exports.getBrandValidator = [check('brandId').isMongoId().withMessage('invalid id'), validatorMiddelware,]


exports.createBrandValidator = [
    check('name').notEmpty()
        .withMessage('brand required')
        .isLength({ min: 3 })
        .withMessage('Too short brand name')
        .isLength({ max: 32 })
        .withMessage('Too long brand name'),
        validatorMiddelware
]

exports.updateBrandValidator = [check('brandId').isMongoId().withMessage('invalid id'), validatorMiddelware,]
exports.deleteBrandValidator = [check('brandId').isMongoId().withMessage('invalid id'), validatorMiddelware,]