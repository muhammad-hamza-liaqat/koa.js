const {
  stripeSubscription,
  userSubscriptionStatus,
  deleteSubscription,
  stripeWebHook,
  updateSubscriptionCard,
  upcomingBills,
  getSubscriptionDetails,
  createTestClockAndSubscription,
  fastForwardTestClock
} = require('../controllers/stripe.controller')
const { catchAsyncErrors } = require('../helpers/tryCatch.helper')
const Router = require('koa-router')
const rawBodyMiddleware = require('../middlewares/bodyParser.koa')
const stripeRoutes = new Router({ prefix: '/stripe' })
const { validationCatches } = require('../helpers/validation.helper')
const {
  stripeSubscriptionValidation,
  userStatusValidation,
  deleteSubscriptionValidation,
  updateSubscriptionCardValidation
} = require('../helpers/customValidations.yup')

stripeRoutes.post(
  '/subscription',
  validationCatches(stripeSubscriptionValidation),
  catchAsyncErrors(stripeSubscription)
)
stripeRoutes.post(
  '/status',
  validationCatches(userStatusValidation),
  catchAsyncErrors(userSubscriptionStatus)
)
stripeRoutes.post(
  '/cancel-subscription',
  validationCatches(deleteSubscriptionValidation),
  catchAsyncErrors(deleteSubscription)
)
stripeRoutes.post(
  '/update-subscription-card',
  validationCatches(updateSubscriptionCardValidation),
  catchAsyncErrors(updateSubscriptionCard)
)
stripeRoutes.post(
  '/webhook',
  rawBodyMiddleware,
  catchAsyncErrors(stripeWebHook)
)
stripeRoutes.get('/upcoming/:id', catchAsyncErrors(upcomingBills))

stripeRoutes.get('/getDetails', catchAsyncErrors(getSubscriptionDetails))

stripeRoutes.post('/subscription-test', catchAsyncErrors(createTestClockAndSubscription))

stripeRoutes.post('/testClock-fast', catchAsyncErrors(fastForwardTestClock))

module.exports = { stripeRoutes }
