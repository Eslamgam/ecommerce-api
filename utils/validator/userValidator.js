
const { check } = require('express-validator')
const validatorMiddelware = require('../../middelware.js/validatorMiddelware')


// exports.getBrandValidator = [check('brandId').isMongoId().withMessage('invalid id'), validatorMiddelware,]


exports.createUserValidator = [
    check('firstName').notEmpty()
        .withMessage('firstName required')
        .isLength({ min: 3 })
        .withMessage('Too short firstName name')
        .isLength({ max: 32 })
        .withMessage('Too long firstName name'),
    check('email').notEmpty()
        .withMessage('email required')
        .isLength({ min: 10 })
        .withMessage('Too short email name')
        .isLength({ max: 32 })
        .withMessage('Too long email name'),
    check('password').notEmpty()
        .withMessage('password required')
        .isLength({ min: 3 })
        .withMessage('Too short password name')
        .isLength({ max: 32 })
        .withMessage('Too long password name'),
    validatorMiddelware
]

// exports.updateBrandValidator = [check('brandId').isMongoId().withMessage('invalid id'), validatorMiddelware,]
// exports.deleteBrandValidator = [check('brandId').isMongoId().withMessage('invalid id'), validatorMiddelware,]











// firstName: {
//     type: String,
//     required: [true,'firstName required']
// },
// lastName: {
//     type: String,
//     required: true
// },
// email: {
//     type: String,
//     required: [true,'email required'],
//     unique: true,
//     validate: [validator.isEmail , 'filed must be a valid email address']
// },
// password: {
//     type: String,
//     required: true
// },
// role: {
//     type: String, // ["USER", "ADMIN", "MANGER"]
//     enum: [userRoles.USER, userRoles.ADMIN, userRoles.MANGER],
//     default: userRoles.USER
// },
// avatar: {
//     type: String,
//     // default: 'uploads/profile.png'
// }

// })