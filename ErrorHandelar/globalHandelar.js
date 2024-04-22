
// const httpStatusText = require('../utils/httpStatusText')
const httpStatusText = require('../utils/httpStatusText')

module.exports = (error, req, res, next) => {
    res.status(error.statusCode || 500).json({status: error.statusText || httpStatusText.ERROR, message: error.message, code: error.statusCode || 500, data: null});
}