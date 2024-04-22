
const asyncWrapper = require('../middelware.js/asyncWrapper');
const validatorMiddelware = require('../middelware.js/validatorMiddelware');
const Category = require('../models/category.model')
const appError = require('../utils/appError')
const httpStatusText = require('../utils/httpStatusText')

const ApiFeatures = require('../utils/apiFeatuer')


const getCategories = asyncWrapper(
    async (req, res, next) => {


        const countDocuments = await Category.countDocuments()
        const apiFeature = new ApiFeatures(Category.find(), req.query)
            .paginate(countDocuments)
            .filter()
            .search()
            .limitFields()
            .sort()
        const { paginationResult ,mongooseQuery} = apiFeature
        const categories = await mongooseQuery;

        res.status(200).json({ state: httpStatusText.SUCCESS,paginationResult, categories: { categories } })

    }
)



const addCategory = asyncWrapper(async (req, res) => {
    const { name } = req.body
    console.log('file ===========', req.file);
    validatorMiddelware
    const newCategory = new Category({
        name,
        image: req.file.filename
    })
    await newCategory.save()

    res.status(200).json({ state: httpStatusText.SUCCESS, data: { newCategory } })
})


const getCategory = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.categoryId
        const category = await Category.findById(id)
        if (!category) {
            return next(appError.create('category not found', 404, httpStatusText.ERROR))
        }
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { category } })

    }
)


const updateCategory = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.categoryId
        const category = await Category.findById(id)
        if (!category) {
            return next(appError.create('category not found', 404, httpStatusText.ERROR))
        }

        const updatedCategory = await Category.updateOne({ _id: id }, { $set: { ...req.body } })
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { updatedCategory } })


    }
)


const deleteCategory = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.categoryId
        const category = await Category.findById(id)
        if (!category) {
            return next(appError.create('category not found', 404, httpStatusText.ERROR))
        }
        const deletedCategory = await Category.deleteOne({ _id: id })
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { deletedCategory }, message: 'category deleted' })

    }
)

module.exports = { addCategory, getCategories, getCategory, updateCategory, deleteCategory }