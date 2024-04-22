
const asyncWrapper = require('../middelware.js/asyncWrapper');
const validatorMiddelware = require('../middelware.js/validatorMiddelware');
const Product = require('../models/product.model')
const appError = require('../utils/appError')
const httpStatusText = require('../utils/httpStatusText')

// const apiFeature = require('../utils/apiFeatuer');
const ApiFeatures = require('../utils/apiFeatuer');
// const apiFeatuer = require('../utils/apiFeatuer');

const getProducts = asyncWrapper(
    async (req, res, next) => {


        const countDocuments = await Product.countDocuments()
        const apiFeature = new ApiFeatures(Product.find(), req.query)
            .paginate(countDocuments)
            .filter()
            .search('Product')
            .limitFields()
            .sort()
        const { paginationResult ,mongooseQuery} = apiFeature
        const products = await mongooseQuery;

        res.status(200).json({ state: httpStatusText.SUCCESS, paginationResult, products: { products } })

    }
)



const addProduct = asyncWrapper(async (req, res) => {
    const { title,
        quantity,
        sold,
        price,
        priceAfterDiscount,
        description,
        category,
        imageCover,
        ratingsAverage,
        ratingsQuantity,
        subcategories
    } = req.body
    validatorMiddelware
    console.log('file=====================================',req.file);
    const newProduct = new Product({
        title,
        quantity,
        sold,
        price,
        priceAfterDiscount,
        description,
        category,
        imageCover: req.file.filename,
        ratingsAverage,
        ratingsQuantity,
        subcategories
    })
    await newProduct.save()

    res.status(200).json({ state: httpStatusText.SUCCESS, data: { newProduct } })
})


const getProduct = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.productId

        const product = await Product.findById(id).populate({ path: 'category', select: 'name' })
        if (!product) {
            return next(appError.create('product not found', 404, httpStatusText.ERROR))
        }
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { product } })

    }
)


const updateProduct = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.productId

        const product = await Product.findById(id)
        if (!product) {
            return next(appError.create('product not found', 404, httpStatusText.ERROR))
        }

        const updatedProduct = await Product.updateOne({ _id: id }, { $set: { ...req.body } })
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { updatedProduct } })


    }
)


const deleteProduct = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.productId
        const product = await Product.findById(id)
        if (!product) {
            return next(appError.create('product not found', 404, httpStatusText.ERROR))
        }
        const deletedProduct = await Product.deleteOne({ _id: id })
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { deletedProduct }, message: 'product deleted' })

    }
)

module.exports = { addProduct, getProducts, getProduct, updateProduct, deleteProduct }