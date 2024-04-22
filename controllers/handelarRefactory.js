

const asyncWrapper = require('../middelware.js/asyncWrapper');
const validatorMiddelware = require('../middelware.js/validatorMiddelware');
const Brand = require('../models/brand.model')
const appError = require('../utils/appError')
const httpStatusText = require('../utils/httpStatusText')

const ApiFeatures = require('../utils/apiFeatuer');
const { Model } = require('mongoose');

exports.deleteDocument = (Model)=>{
    asyncWrapper(
        async (req, res, next) => {
            const id = req.params.id
            const document = await Model.findById(id)
            if (!document) {
                return next(appError.create('category not found', 404, httpStatusText.ERROR))
            }
            const deleteDocument = await Model.deleteOne({ _id: id })
            return res.status(200).json({ state: httpStatusText.SUCCESS, data: { deleteDocument }, message: 'barnd deleted' })
    
        }
    )
}


exports.updateDocument = (Model)=>{
    asyncWrapper(
        async (req, res, next) => {
            const document = await Model.findById(req.params.id)
            if (!document) {
                return next(appError.create('category not found', 404, httpStatusText.ERROR))
            }
            const updateddocument = await Model.updateOne({ _id: req.params.brandId }, { $set: { ...req.body } })
            return res.status(200).json({ state: httpStatusText.SUCCESS, data: { updateddocument } })
        }
    )
}



exports.getDocument = (Model)=>{
    asyncWrapper(
        async (req, res, next) => {
            const document = await Model.findById(req.params.id)
            if (!document) {
                return next(appError.create('category not found', 404, httpStatusText.ERROR))
            }
            return res.status(200).json({ state: httpStatusText.SUCCESS, data: { document } })
    
        }
    )
}


exports.getDocuments = (Model)=>{
    asyncWrapper(
        async (req, res, next) => {
            const countDocuments = await Model.countDocuments()
            const apiFeature = new ApiFeatures(Model.find(), req.query)
                .paginate(countDocuments)
                .filter()
                .search()
                .limitFields()
                .sort()
            const { paginationResult ,mongooseQuery} = apiFeature
            const document = await mongooseQuery;
    
            res.status(200).json({ state: httpStatusText.SUCCESS,paginationResult, document: { document } })
    
        }
    )
}

// module.exports={deleteDocument}