
const asyncWrapper = require('../middelware.js/asyncWrapper');
const validatorMiddelware = require('../middelware.js/validatorMiddelware');
const Brand = require('../models/brand.model')
const appError = require('../utils/appError')
const httpStatusText = require('../utils/httpStatusText')
const handelarRefactory = require('./handelarRefactory')
const ApiFeatures = require('../utils/apiFeatuer')

// exports.getBrands = handelarRefactory.getDocuments(Brand)


const getBrands = asyncWrapper(
    async (req, res, next) => {
        const countDocuments = await Brand.countDocuments()
        const apiFeature = new ApiFeatures(Brand.find(), req.query)
            .paginate(countDocuments)
            .filter()
            .search()
            .limitFields()
            .sort()
        const { paginationResult, mongooseQuery } = apiFeature
        const brand = await mongooseQuery;

        res.status(200).json({ state: httpStatusText.SUCCESS, paginationResult, brands: { brand } })

    }
)



const addBrand = asyncWrapper(async (req, res) => {
    const { name } = req.body
    console.log('name====================', name);
    console.log('filename====================', req.file);

    validatorMiddelware
    const newBrand = new Brand({
        name,
        image: req.file.filename
    })
    await newBrand.save()
    res.status(200).json({ state: httpStatusText.SUCCESS, data: { newBrand } })
})



// exports.getBrand = handelarRefactory.getDocument(Brand)




const getBrand = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.brandId
        const brand = await Brand.findById(id)
        if (!brand) {
            return next(appError.create('category not found', 404, httpStatusText.ERROR))
        }
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { brand } })

    }
)

// exports.updateBrand = handelarRefactory.updateDocument(Brand)

const updateBrand = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.brandId
        const brand = await Brand.findById(id)
        if (!brand) {
            return next(appError.create('category not found', 404, httpStatusText.ERROR))
        }
        const updatedBrand = await Brand.updateOne({ _id: id }, { $set: { ...req.body } })
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { updatedBrand } })
    }
)

// exports.deleteBrand = handelarRefactory.deleteDocument(Brand)


const deleteBrand = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.brandId
        const brand = await Brand.findById(id)
        if (!brand) {
            return next(appError.create('category not found', 404, httpStatusText.ERROR))
        }
        const deletedBrand = await Brand.deleteOne({ _id: id })
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { deletedBrand }, message: 'barnd deleted' })

    }
)

module.exports = { addBrand, getBrands, getBrand, updateBrand, deleteBrand } //deleteBrand