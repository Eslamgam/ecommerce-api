

const express = require('express')

// const httpStatusText = require('../utils/httpStatusText')
const verifyToken = require('../middelware.js/verfiyToken')
const router = express.Router({ mergeParams: true })
const subCategoriesController = require('../controllers/subCategory.controller')
// const {setCategoryIdToBody} =  require('../controllers/subCategory.controller')
const { createSubCategoryValidator, getSubCategoryValidator, updateSubCategoryValidator, deleteSubCategoryValidator } = require('../utils/validator/subCategoryValidateor')
const allowedTo = require('../middelware.js/allowedTo')
const userRoles = require('../utils/userRoles')
router.route('/').get(verifyToken,subCategoriesController.createFilterObj, subCategoriesController.getSubCategories)
                 .post(verifyToken,allowedTo(userRoles.ADMIN),subCategoriesController.setCategoryIdToBody, createSubCategoryValidator, subCategoriesController.createSubCategory)
router.route('/:subCategoryId')
    .get(verifyToken,getSubCategoryValidator, subCategoriesController.getSubCategory)
    .patch(verifyToken,allowedTo(userRoles.ADMIN),updateSubCategoryValidator, subCategoriesController.updateSubCategory)
    .delete(verifyToken,allowedTo(userRoles.ADMIN),deleteSubCategoryValidator, subCategoriesController.deleteSubCategory)


module.exports = router
