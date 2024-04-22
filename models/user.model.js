const mongoose = require('mongoose');
const validator = require('validator');
const userRoles = require('../utils/userRoles');
const { generateRandomFourDigitNumber } = require('../controllers/auth/generateRandomCode');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'filed must be a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String, // ["USER", "ADMIN", "MANGER"]
        enum: [userRoles.USER, userRoles.ADMIN, userRoles.MANGER],
        default: userRoles.USER
    },
    updateCode: {
        type: Number,
        default: generateRandomFourDigitNumber()
    },
    avatar: {
        type: String,
        default: 'test/islam.png'
    },
    addresses: [
        {
          id: { type: mongoose.Schema.Types.ObjectId },
          alias: String,
          details: String,
          phone: String,
          city: String,
          postalCode: String,
        },
      ],
      wishlist: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
        },
      ],

})

module.exports = mongoose.model('User', userSchema);