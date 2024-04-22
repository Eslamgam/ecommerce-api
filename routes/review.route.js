const express = require('express');

const verifyToken = require('../middelware.js/verfiyToken')

const { createFilterObj, getReviews, createReview, getReview, deleteReview, updateReview, setProductIdAndUserIdToBody } = require('../controllers/review.controller');
const { createReviewValidator, getReviewValidator, updateReviewValidator, deleteReviewValidator } = require('../utils/validator/reviewValidator');
const allowedTo = require('../middelware.js/allowedTo');
const userRoles = require('../utils/userRoles');


const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(verifyToken,createFilterObj, getReviews)
    .post(verifyToken,allowedTo(userRoles.USER),setProductIdAndUserIdToBody,createReview);
router.route('/:reviewId')
    .get(verifyToken,getReviewValidator,getReview)
    .patch(
        verifyToken,
        allowedTo(userRoles.USER),
        updateReview
    )
    .delete(

        verifyToken,
        deleteReview
    );

module.exports = router;