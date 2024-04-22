const express = require('express');
const { getCoupons, getCoupon, updateCoupon, deleteCoupon, createCoupon } = require('../controllers/coupon.controller');

const verifyToken = require('../middelware.js/verfiyToken');
const allowedTo = require('../middelware.js/allowedTo');
const userRoles = require('../utils/userRoles');


const router = express.Router();


router.route('/')
    .get(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), getCoupons)
    .post(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), createCoupon);
router.route('/:couponId')
    .get(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), getCoupon)
    .patch(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), updateCoupon)
    .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), deleteCoupon);

module.exports = router;