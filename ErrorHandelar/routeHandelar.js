
const httpStatusText = require('../utils/httpStatusText')


module.exports = (req, res, next)=> {
    return res.status(404).json({ status: httpStatusText.ERROR, message: 'this resource is not available'})
}