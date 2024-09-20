const { stripeSubscription, userSubscriptionStatus, deleteSubscription, stripeWebHook, updateSubscriptionCard } = require("../controllers/stripe.controller");
const { catchAsyncErrors } = require("../helpers/tryCatch.helper");
const Router = require("koa-router");
const rawBodyMiddleware = require("../middlewares/bodyParser.koa");
const stripeRoutes = new Router({ prefix: "/stripe" })

stripeRoutes.post("/subscription", catchAsyncErrors(stripeSubscription))
stripeRoutes.post("/status", catchAsyncErrors(userSubscriptionStatus))
stripeRoutes.post("/cancel-subscription", catchAsyncErrors(deleteSubscription))
stripeRoutes.post("/update-subscription-card", catchAsyncErrors(updateSubscriptionCard))
stripeRoutes.post("/webhook", rawBodyMiddleware, catchAsyncErrors(stripeWebHook))

module.exports = { stripeRoutes }
