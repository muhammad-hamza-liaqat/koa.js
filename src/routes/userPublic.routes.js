const Router = require("koa-router");
const { registerMe } = require("../controllers/user.controller");
const { catchAsyncErrors } = require("../helpers/tryCatch.helper")

const userPublicRoutes = new Router({ prefix: "/auth"});

userPublicRoutes.post("/sign-up", catchAsyncErrors(registerMe))


module.exports = { userPublicRoutes }