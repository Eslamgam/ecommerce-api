
const asyncWrapper = require('../middelware.js/asyncWrapper');
const Review = require('../models/review.model');
const appError = require('../utils/appError')
const httpStatusText = require('../utils/httpStatusText')

const ApiFeatures = require('../utils/apiFeatuer');
const validatorMiddelware = require('../middelware.js/validatorMiddelware');
// Nested route
// GET /api/v1/products/:productId/reviews
const createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.id) filterObject = { product: req.params.id };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of reviews
// @route   GET /api/v1/reviews
// @access  Public
const getReviews = asyncWrapper(
    async(req, res, next)=>{
        const countDocuments = await Review.countDocuments()
        const apiFeature = new ApiFeatures(Review.find(), req.query)
            .paginate(countDocuments)
            .filter()
            .search()
            .limitFields()
            .sort()
        const { paginationResult ,mongooseQuery} = apiFeature
        const review = await mongooseQuery;

        res.status(200).json({ state: httpStatusText.SUCCESS,paginationResult, reviews: { review } })
    }
)

// @desc    Get specific review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
const getReview = asyncWrapper(
    async(req, res, next)=>{
        const id = req.params.reviewId

        const review = await Review.findById(id)
        if (!review) {
            return next(appError.create('review not found', 404, httpStatusText.ERROR))
        }
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { review } })
    }
)

// // Nested route (Create)
const setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
// // @desc    Create review
// // @route   POST  /api/v1/reviews
// // @access  Private/Protect/User
const createReview = asyncWrapper(
    async(req, res, next)=>{
        const { title, ratings,user, product } = req.body


    validatorMiddelware
    const newReview = new Review({
        title,
        ratings,
        user,
        product
    })
    await newReview.save()
    res.status(200).json({ state: httpStatusText.SUCCESS, data: { newReview } })
    }
)

// // @desc    Update specific review
// // @route   PUT /api/v1/reviews/:id
// // @access  Private/Protect/User
const updateReview = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.reviewId

        const review = await Review.findById(id)
        if (!review) {
            return next(appError.create('review not found', 404, httpStatusText.ERROR))
        }
        const updatedReview = await Review.updateOne({ _id: id }, { $set: { ...req.body } })
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { updatedReview } })
    }
)

// // @desc    Delete specific review
// // @route   DELETE /api/v1/reviews/:id
// // @access  Private/Protect/User-Admin-Manager
const deleteReview = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.reviewId
        const review = await Review.findById(id)
        if (!review) {
            return next(appError.create('review not found', 404, httpStatusText.ERROR))
        }
        const deletedReview = await Review.deleteOne({ _id: id })
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { deletedReview }, message: 'Review deleted' })

    }
)


module.exports = {getReviews,getReview,createReview,updateReview,deleteReview,createFilterObj,setProductIdAndUserIdToBody}