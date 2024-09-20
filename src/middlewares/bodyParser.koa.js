const bodyParser = require("koa-bodyparser")

const rawBodyMiddleware = bodyParser({
    enableTypes: ['text'],
    extendTypes: {
        text: ['text/plain', 'application/json'],
    },
    onerror: function (err, ctx) {
        ctx.throw('body parse error', 422);
    }
});