const { stripeSubscription, userSubscriptionStatus, deleteSubscription } = require("../controllers/stripe.controller");
const { catchAsyncErrors } = require("../helpers/tryCatch.helper");
const Router = require("koa-router");
const stripeRoutes = new Router({ prefix: "/stripe" })

stripeRoutes.post("/subscription", catchAsyncErrors(stripeSubscription))
stripeRoutes.post("/status", catchAsyncErrors(userSubscriptionStatus))
stripeRoutes.post("/cancel-subscription", catchAsyncErrors(deleteSubscription))

module.exports = { stripeRoutes }
