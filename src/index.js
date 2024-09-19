const koa = require("koa");
const bodyParser = require("koa-bodyparser");
const Router = require("koa-router");
const startServer = require("./config/server.config");
require("dotenv").config();
const app = new koa();
const protectedRoutes = require("./routes/protected.routes")
const publicRoutes = require("./routes/userPublic.routes")


app.use(bodyParser());
const mainRouter = new Router();

mainRouter.use(publicRoutes.userPublicRoutes.routes());
mainRouter.use(publicRoutes.userPublicRoutes.allowedMethods());
mainRouter.use(protectedRoutes.protectedRoutes.routes());
mainRouter.use(protectedRoutes.protectedRoutes.allowedMethods());

app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());

startServer(app)