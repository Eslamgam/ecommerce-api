const { check } = require('express-validator')
const validatorMiddelware = require('../../middelware.js/validatorMiddelware')




exports.createSubCategoryValidator = [
    check('name').notEmpty()
        .withMessage('Category required')
        .isLength({ min: 3 })
        .withMessage('Too short category name')
        .isLength({ max: 32 })
        .withMessage('Too long category name'),
    check('category').notEmpty()
    .withMessage('Category id required').isMongoId().withMessage('invalid category id'),
    validatorMiddelware,
]

exports.getSubCategoryValidator = [check('subCategoryId').isMongoId().withMessage('invalid id'),validatorMiddelware]
exports.updateSubCategoryValidator = [check('subCategoryId').isMongoId().withMessage('invalid id'), validatorMiddelware,]
exports.deleteSubCategoryValidator = [check('subCategoryId').isMongoId().withMessage('invalid id') ,validatorMiddelware,]

