

const express = require('express')
const router = express.Router()
const subCategoryRoute = require('./subCategory.route')
router.use('/:categoryId/subCategories', subCategoryRoute)
const categoryController = require('../controllers/category.controller')
const multer = require('multer');
const verifyToken = require('../middelware.js/verfiyToken')
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/category');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `category-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
})

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];

    if (imageType === 'image') {
        return cb(null, true)
    } else {
        return cb(appError.create('file must be an image', 400), false)
    }
}

const upload = multer({
    storage: diskStorage,
    fileFilter
})
const { getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator } = require('../utils/validator/categoryValidator')
const allowedTo = require('../middelware.js/allowedTo')
const userRoles = require('../utils/userRoles')
router.route('/')
    .post(verifyToken, allowedTo(userRoles.ADMIN),upload.single('image'), createCategoryValidator, categoryController.addCategory)
    .get(verifyToken, categoryController.getCategories)
router.route('/:categoryId')
    .get(verifyToken, getCategoryValidator, categoryController.getCategory)
    .patch(verifyToken, allowedTo(userRoles.ADMIN), updateCategoryValidator, categoryController.updateCategory)
    .delete(verifyToken, allowedTo(userRoles.ADMIN), deleteCategoryValidator, categoryController.deleteCategory)
module.exports = router