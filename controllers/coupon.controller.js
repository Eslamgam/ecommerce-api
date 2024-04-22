


const asyncWrapper = require("../middelware.js/asyncWrapper");

const Coupon = require('../models/coupon.model');

const httpStatusText = require('../utils/httpStatusText');
const ApiFeatures = require('../utils/apiFeatuer')

const validatorMiddelware = require('../middelware.js/validatorMiddelware');
const appError = require('../utils/appError')

const getCoupons = asyncWrapper(
    async (req, res, next) => {
        const countDocuments = await Coupon.countDocuments()
        const apiFeature = new ApiFeatures(Coupon.find(), req.query)
            .paginate(countDocuments)
            .filter()
            .search()
            .limitFields()
            .sort()
        const { paginationResult, mongooseQuery } = apiFeature
        const coupon = await mongooseQuery;

        res.status(200).json({ state: httpStatusText.SUCCESS, paginationResult, coupons: { coupon } })

    });


const getCoupon = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.couponId
        const coupon = await Coupon.findById(id)
        if (!coupon) {
            return next(appError.create('coupon not found', 404, httpStatusText.ERROR))
        }
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { coupon } })

    }
)


const createCoupon = asyncWrapper(async (req, res) => {
    const { name, expire, discount } = req.body

    validatorMiddelware
    const newCoupon = new Coupon({
        name,
        expire,
        discount
    })
    await newCoupon.save()
    res.status(200).json({ state: httpStatusText.SUCCESS, data: { newCoupon } })
})


const updateCoupon = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.couponId
        const coupon = await Coupon.findById(id)
        if (!coupon) {
            return next(appError.create('coupon not found', 404, httpStatusText.ERROR))
        }
        const updatedCoupon = await Coupon.updateOne({ _id: id }, { $set: { ...req.body } })
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { updatedCoupon } })
    }
)

const deleteCoupon = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.couponId
        const coupon = await Coupon.findById(id)
        if (!coupon) {
            return next(appError.create('category not found', 404, httpStatusText.ERROR))
        }
        const deletedCoupon = await Coupon.deleteOne({ _id: id })
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { deletedCoupon }, message: 'Coupon deleted' })

    }
)

module.exports = { getCoupons, getCoupon, createCoupon, updateCoupon, deleteCoupon }