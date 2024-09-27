require('dotenv').config()
const koa = require('koa')
const bodyParser = require('koa-bodyparser')
const { stripeRoutes } = require('./routes/stripe.routes')
const startServer = require('./config/server.config')

const app = new koa()
app.use(bodyParser())

app.use(stripeRoutes.routes())
app.use(stripeRoutes.allowedMethods())

startServer(app)
