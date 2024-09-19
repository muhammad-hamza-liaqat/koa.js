const Router = require("koa-router");
const { catchAsyncErrors } = require("../helpers/tryCatch.helper");
const { getAllUsers } = require("../controllers/user.controller");

const protectedRoutes = new Router({ prefix: "/users" });

protectedRoutes.get("/get-users", catchAsyncErrors(getAllUsers))

module.exports = { protectedRoutes }


