const asyncWrapper = require("../middelware.js/asyncWrapper");
const validatorMiddelware = require("../middelware.js/validatorMiddelware");


const SubCategory = require('../models/subCategory.model');
const appError = require("../utils/appError");
const httpStatusText = require('../utils/httpStatusText')

const ApiFeatures = require('../utils/apiFeatuer');


const createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.id) filterObject = { category: req.params.id };
    req.filterObj = filterObject;
    next();
  };
const getSubCategories = asyncWrapper(
    async (req, res, next) => {

        const countDocuments = await SubCategory.countDocuments()
        const apiFeature = new ApiFeatures(SubCategory.find(), req.query)
            .paginate(countDocuments)
            .filter()
            .search()
            .limitFields()
            .sort()
        const { paginationResult ,mongooseQuery} = apiFeature
        const subCategories = await mongooseQuery;


       
        return res.status(200).json({ state: httpStatusText.SUCCESS,paginationResult, data: { subCategories } })
    }
)


const setCategoryIdToBody = (req, res, next) => {
    if (!req.body.category) req.body.category = req.params.categoryId;
    next()
}
const createSubCategory = asyncWrapper(
    async (req, res, next) => {


        const { name, category } = req.body;
        validatorMiddelware

        const oldSubCategory = await SubCategory.findOne({ name: name });
        if (oldSubCategory) {
            return next(appError.create('subCategory already exist', 400, httpStatusText.ERROR))
        }
        const newSubCategory = new SubCategory({
            name,
            category
        })

        await newSubCategory.save()
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { newSubCategory } })

    }
)

const getSubCategory = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.subCategoryId
        const subCategory = await SubCategory.findById(id).populate({ path: 'category', select: 'name -_id' })
        if (!subCategoryId) {
            return next(appError.create('subCategory not found', 400, httpStatusText.ERROR))
        }
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { subCategory } })

    }
)


const updateSubCategory = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.subCategoryId

        const subCategory = await SubCategory.findById(id)
        if (!subCategory) {
            return next(appError.create('subCategory not found', 404, httpStatusText.ERROR))
        }

        const updatedSubCategory = await SubCategory.updateOne({ _id: id }, { $set: { ...req.body } })
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { updatedSubCategory } })


    }
)


const deleteSubCategory = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.subCategoryId
        const subCategory = await SubCategory.findById(id)
        if (!subCategory) {
            return next(appError.create('category not found', 404, httpStatusText.ERROR))
        }
        const deletedSubCategory = await SubCategory.deleteOne({ _id: id })
        return res.status(200).json({ state: httpStatusText.SUCCESS, data: { deletedSubCategory }, message: 'category deleted' })

    }
)

module.exports = { getSubCategories, createSubCategory, getSubCategory, updateSubCategory, deleteSubCategory ,setCategoryIdToBody,createFilterObj}