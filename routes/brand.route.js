

const express = require('express')
const router = express.Router()
const brandController = require('../controllers/brand.controller')

const multer = require('multer');
const verifyToken = require('../middelware.js/verfiyToken')
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/brands');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `brands-${Date.now()}.${ext}`;
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
const {
    createBrandValidator,
    getBrandValidator,
    updateBrandValidator,
    deleteBrandValidator } = require('../utils/validator/brandValidator');

const allowedTo = require('../middelware.js/allowedTo');
const userRoles = require('../utils/userRoles');
router.route('/')
    .post( verifyToken,allowedTo(userRoles.ADMIN),upload.single('image') ,createBrandValidator,brandController.addBrand)
    .get(verifyToken,brandController.getBrands)
router.route('/:brandId')
    .get(verifyToken,getBrandValidator,brandController.getBrand )
    .patch(verifyToken,allowedTo(userRoles.ADMIN),updateBrandValidator,brandController.updateBrand )
    .delete(verifyToken,allowedTo(userRoles.ADMIN),deleteBrandValidator,brandController.deleteBrand)   
module.exports = router