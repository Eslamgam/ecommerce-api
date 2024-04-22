const express = require('express');
const { checkoutSession, createCashOrder, filterOrderForLoggedUser, findAllOrders, findSpecificOrder, updateOrderToPaid, updateOrderToDelivered } = require('../controllers/order.controller');
// const {
//   createCashOrder,
//   findAllOrders,
//   findSpecificOrder,
//   filterOrderForLoggedUser,
//   updateOrderToPaid,
//   updateOrderToDelivered,
//   checkoutSession,
// } = require('../services/orderService');

// const authService = require('../services/authService');
const allowedTo = require('../middelware.js/allowedTo');
const userRoles = require('../utils/userRoles');
const router = express.Router();

// router.use(authService.protect);
const verifyToken = require('../middelware.js/verfiyToken')

router.get(
  '/checkout-session/:cartId',verifyToken,
  allowedTo(userRoles.USER),
  checkoutSession
);

router.route('/:cartId').post(verifyToken,allowedTo(userRoles.USER), createCashOrder);
router.get(
  '/',verifyToken,
  filterOrderForLoggedUser,
  findAllOrders
);
router.get('/:orderId',verifyToken, findSpecificOrder);

router.put(
  '/:orderId/pay',verifyToken,
  allowedTo(userRoles.ADMIN, userRoles.MANGER),
  updateOrderToPaid
);
router.put(
  '/:orderId/deliver',verifyToken,
  allowedTo(userRoles.ADMIN, userRoles.MANGER),
  updateOrderToDelivered
);

module.exports = router;