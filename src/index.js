require('dotenv').config()
const koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const mainRoutes = new Router()

const startServer = require('./config/server.config')
const { stripeRoutes } = require('./routes/stripe.routes')

const app = new koa()
app.use(bodyParser())

mainRoutes.use(stripeRoutes.routes())
mainRoutes.use(stripeRoutes.allowedMethods())

app.use(mainRoutes.routes())
app.use(mainRoutes.allowedMethods())

startServer(app)
