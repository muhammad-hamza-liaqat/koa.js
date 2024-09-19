const koa = require("koa");
const bodyParser = require("koa-bodyparser");
const startServer = require("./config/server.config");
require("dotenv").config();
const app = new koa();

app.use(bodyParser());

startServer(app)