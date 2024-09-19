const StatusCodes = require('http-status-codes')
const { HTTPError } = require('./response.helper')

const catchAsyncErrors = action => async (req, res, next) => {
    try {
        await action(req, res, next)
    } catch (error) {
        console.log('catchAsyncErrors ==>', error)
        const err = new HTTPError(
            'Internal Server Error',
            StatusCodes.INTERNAL_SERVER_ERROR,
            error
        )
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
    }
}



module.exports = {
    catchAsyncErrors
}