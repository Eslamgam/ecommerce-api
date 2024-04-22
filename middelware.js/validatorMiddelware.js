
const {validationResult} = require('express-validator');
const appError = require('../utils/appError');
const httpStatusText = require('../utils/httpStatusText')
const validatorMiddelware = (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(appError.create(errors.array(), 400, httpStatusText.FAIL));
    }
    next()
}


module.exports = validatorMiddelware