const express = require('express');
const { addProductToCart, getLoggedUserCart, clearCart, applyCoupon, updateCartItemQuantity, removeSpecificCartItem } = require('../controllers/cart.controller');

const verifyToken = require('../middelware.js/verfiyToken');
const allowedTo = require('../middelware.js/allowedTo');
const userRoles = require('../utils/userRoles');


const router = express.Router();

router
  .route('/')
  .post(verifyToken,allowedTo(userRoles.USER),addProductToCart)
  .get(verifyToken,allowedTo(userRoles.USER),getLoggedUserCart)
  .delete(verifyToken,allowedTo(userRoles.USER),clearCart);

router.put('/applyCoupon',verifyToken,allowedTo(userRoles.USER), applyCoupon);

router
  .route('/:itemId')
  .put(verifyToken,allowedTo(userRoles.USER),updateCartItemQuantity)
  .delete(verifyToken,allowedTo(userRoles.USER),removeSpecificCartItem);

module.exports = router;