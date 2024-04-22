const express = require('express');

const verifyToken = require('../middelware.js/verfiyToken')


const router = express.Router();
const addressController = require('../controllers/address.controller');
const allowedTo = require('../middelware.js/allowedTo');
const userRoles = require('../utils/userRoles');
// router.use(authService.protect, authService.allowedTo('user'));

router.route('/').post(verifyToken,allowedTo(userRoles.USER), addressController.addAddress)
    .get(verifyToken,allowedTo(userRoles.USER), addressController.getLoggedUserAddresses);

router.delete('/:addressId', verifyToken,allowedTo(userRoles.USER),  addressController.removeAddress);

module.exports = router;