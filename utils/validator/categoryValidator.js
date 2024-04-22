
const { check } = require('express-validator')
const validatorMiddelware = require('../../middelware.js/validatorMiddelware')


exports.getCategoryValidator = [check('categoryId').isMongoId().withMessage('invalid id'), validatorMiddelware,]


exports.createCategoryValidator = [
    check('name').notEmpty()
        .withMessage('Category required')
        .isLength({ min: 3 })
        .withMessage('Too short category name')
        .isLength({ max: 32 })
        .withMessage('Too long category name'),
        validatorMiddelware
]

exports.updateCategoryValidator = [check('categoryId').isMongoId().withMessage('invalid id'), validatorMiddelware,]
exports.deleteCategoryValidator = [check('categoryId').isMongoId().withMessage('invalid id'), validatorMiddelware,]