

const express = require('express')
const router = express.Router()
const productController = require('../controllers/product.controller')
const { createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator } = require('../utils/validator/productValidator')
const multer = require('multer');
const verifyToken = require('../middelware.js/verfiyToken');
const allowedTo = require('../middelware.js/allowedTo');
const userRoles = require('../utils/userRoles');
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/product');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `product-${Date.now()}.${ext}`;
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


router.route('/')
    .post(verifyToken,allowedTo(userRoles.ADMIN),upload.single('imageCover'),createProductValidator, productController.addProduct)
    .get(verifyToken,productController.getProducts)
router.route('/:productId')
    .get(verifyToken,getProductValidator, productController.getProduct)
    .patch(verifyToken,allowedTo(userRoles.ADMIN),updateProductValidator, productController.updateProduct)
    .delete(verifyToken,allowedTo(userRoles.ADMIN),deleteProductValidator, productController.deleteProduct)
module.exports = router