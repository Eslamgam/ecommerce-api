const asyncWrapper = require("../middelware.js/asyncWrapper");

const User = require('../models/user.model');
const appError = require("../utils/appError");
const { generateRandomFourDigitNumber } = require("./auth/generateRandomCode");
const httpStatusText = require('../utils/httpStatusText');
const sendEmailWithNaodeMailer = require("./auth/send_email");

const sendVerfiyCode = asyncWrapper(
    async(req, res, next)=>{
        const {email} = req.body

        const user = await User.findOne({email: email})
        if(!user){
            return next(appError.create(`this email=> ${email} not found`))
        }
        const number= generateRandomFourDigitNumber()
         await User.updateOne({ email: email }, { $set: { 'updateCode': number } })
        console.log('newUpdateCode =============', number);
        sendEmailWithNaodeMailer(email, number, user.firstName)
        // sendEmailWithNaodeMailer(email, number, user.firstName)
    }
)

const checkVerfiyCode = asyncWrapper(
    async(req, res, next)=>{
      const user = await User.findOne({email: req.body.email})
      if(!user){
        return next(appError.create('email incorrect', 400, httpStatusText.ERROR))
      }
      if(req.body.updateCode != user.updateCode){
        return next(appError.create('code incorrect', 400, httpStatusText.ERROR))

      }

      return res.status(200).json({state: httpStatusText.SUCCESS, message: 'code verfiyed'})
    }
)



const resetPassword = asyncWrapper(
    async(req, res, next)=>{
      const {email, password, repassword} = req.body
      const user = await User.findOne({email: email})
      if(!user){
        return next(appError.create('email incorrect', 400, httpStatusText.ERROR))
      }
      if(password != repassword){
        return next(appError.create('passwords not  matchs', 400, httpStatusText.ERROR))
      }

    const updatePassword=  await User.updateOne({email: user.email}, {$set: {'password': password}})
     

    return res.status(200).json({state: httpStatusText.SUCCESS,data: {updatePassword}, message: 'password verfiyed'})
    }
)


module.exports = {sendVerfiyCode,checkVerfiyCode,resetPassword}