const statusCodes = require('http-status-codes')
const { HTTPResponse, HTTPError } = require('../helpers/response.helper')
const stripe = require('stripe')(process.env.STRIPE_SECRET)

const stripeSubscription = async ctx => {
  let response
  const { priceId } = ctx.request.body
  // console.log("body", ctx.request.body);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: process.env.SUCCESS_URL,
    cancel_url: process.env.CANCEL_URL
  })
  // console.log('Session:', session);
  response = new HTTPResponse('Session created successfully!', session.url)
  ctx.status = statusCodes.CREATED
  ctx.body = response
}

const userSubscriptionStatus = async ctx => {
  const { subscriptionId } = ctx.request.body
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  // console.log("subscription status", subscription.status);
  let response = new HTTPResponse('subscription retrieved successfully!', {
    subscriptionStatus: subscription.status
  })
  // console.log("response", response);
  ctx.status = statusCodes.OK
  ctx.body = response
}

const deleteSubscription = async ctx => {
  const { subscriptionId } = ctx.request.body
  const cancelSubscription = await stripe.subscriptions.cancel(subscriptionId, {
    prorate: false // You can set this to true if you want prorated refunds
  })
  // console.log("subscription cancelled!", cancelSubscription)
  let response = new HTTPResponse(
    'subscription cancelled successfully!',
    cancelSubscription
  )
  ctx.status = statusCodes.OK
  ctx.body = response
}

const stripeWebHook = async ctx => {
  console.warn("inside webhook of stripe--------------------------->")

  const sig = ctx.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      ctx.request.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    console.log(`⚠️ webhook signature verification failed: ${error.message}`)
    const errors = new HTTPError(
      'Webhook signature verification failed',
      statusCodes.BAD_REQUEST
    )
    ctx.status = statusCodes.BAD_REQUEST
    ctx.body = errors
    return
  }
  console.log("event incoming", event.type);

  switch (event.type) {
    case 'customer.subscription.created':
      const subscriptionCreated = event.data.object
      console.log('Subscription created:', subscriptionCreated.id)
      break

    case 'customer.subscription.updated':
      const subscriptionUpdated = event.data.object
      console.log('Subscription updated:', subscriptionUpdated.id)
      if (subscriptionUpdated.status === 'past_due') {
        console.log(
          `Subscription is past due for customer ${subscriptionUpdated.customer}`
        )
      }
      break

    case 'customer.subscription.deleted':
      const subscriptionDeleted = event.data.object
      console.log('Subscription canceled:', subscriptionDeleted.id)

      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }
  let response = new HTTPResponse('webhook successfully implemented', {
    receivedEvent: true
  })
  ctx.status = statusCodes.OK
  ctx.body = response
}

module.exports = {
  stripeSubscription,
  userSubscriptionStatus,
  deleteSubscription,
  stripeWebHook
}
