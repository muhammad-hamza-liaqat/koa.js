const StatusCodes = require('http-status-codes');
const { HTTPError } = require('./response.helper');

const catchAsyncErrors = action => {
    return async (ctx, next) => {
        try {
            await action(ctx, next);
        } catch (error) {
            console.log('catchAsyncErrors ==>', error);

            const err = new HTTPError(
                'Internal Server Error',
                StatusCodes.INTERNAL_SERVER_ERROR,
                error
            );

            ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
            ctx.body = err;
        }
    };
};

module.exports = {
    catchAsyncErrors
};
