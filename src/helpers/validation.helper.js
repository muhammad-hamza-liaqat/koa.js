const { HTTPError } = require("./response.helper")
const StatusCodes = require("http-status-codes")

const validationCatches = validation => async (req, res, next) => {
    try {
        await validation(req, res, next)
    } catch (error) {
        console.log('validationCatches errors==>', error)
        const err = new HTTPError(
            'Validations failed',
            StatusCodes.BAD_REQUEST,
            error.errors
        )
        res.status(StatusCodes.BAD_REQUEST).json(err)
    }
}

module.exports = { validationCatches }