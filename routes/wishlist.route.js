const express = require('express');


const verifyToken = require('../middelware.js/verfiyToken')

const wishlistController = require('../controllers/wishlist.controller');
const allowedTo = require('../middelware.js/allowedTo');
const userRoles = require('../utils/userRoles');

const router = express.Router();


router.route('/').post(verifyToken,allowedTo(userRoles.USER),wishlistController.addProductToWishlist)
.get(verifyToken,allowedTo(userRoles.USER),wishlistController.getLoggedUserWishlist);

router.delete('/:productId',verifyToken,allowedTo(userRoles.USER), wishlistController.removeProductFromWishlist);

module.exports = router;