


const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')



router.post('/sendCodeToEmail', authController.sendVerfiyCode)
router.post('/checkCode', authController.checkVerfiyCode)
router.post('/resetPass', authController.resetPassword)


module.exports = router