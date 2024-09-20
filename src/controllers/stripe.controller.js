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

const stripeWebHook = async (ctx) => {
  console.warn("Inside webhook of Stripe --------------------------->");

  const sig = ctx.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      ctx.request.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(`⚠️ Webhook signature verification failed: ${error.message}`);
    const errors = new HTTPError(
      'Webhook signature verification failed',
      statusCodes.BAD_REQUEST
    );
    ctx.status = statusCodes.BAD_REQUEST;
    ctx.body = errors;
    return;
  }

  console.log("Event incoming:", event.type);

  switch (event.type) {
    case 'customer.subscription.created':
      const subscriptionCreated = event.data.object;
      console.log('Subscription created:', subscriptionCreated.id);
      break;

    case 'customer.subscription.updated':
      console.log("Inside customer.subscription.updated webhook event------------------------->");
      const subscriptionUpdated = event.data.object;
      console.log('Subscription updated:', subscriptionUpdated.id);

      if (subscriptionUpdated.default_payment_method) {
        console.log("Inside {customer.subscription.updated}> {subscriptionUpdated.default_payment_method}");
        console.log('New default payment method:', subscriptionUpdated.default_payment_method);
      }
      break;

    case 'customer.subscription.deleted':
      const subscriptionDeleted = event.data.object;
      console.log('Subscription canceled:', subscriptionDeleted.id);
      break;

    case 'customer.subscription.paused':
      const subscriptionPaused = event.data.object;
      console.log('Subscription paused:', subscriptionPaused.id);
      break;

    case 'subscription_schedule.canceled':
      const scheduledCancel = event.data.object;
      console.log('Scheduled subscription canceled:', scheduledCancel.id);
      break;

    case 'invoice.payment_failed':
      const invoiceFailed = event.data.object;
      console.log('Payment failed for invoice:', invoiceFailed.id);
      console.log(`Customer ${invoiceFailed.customer} payment failed. Subscription ID: ${invoiceFailed.subscription}`);
      break;

    case 'payment_method.attached':
      const paymentMethodAttached = event.data.object;
      console.log('Payment method attached:', paymentMethodAttached.id);
      console.log(`Payment method ${paymentMethodAttached.id} was attached to customer ${paymentMethodAttached.customer}.`);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  const response = new HTTPResponse('Webhook successfully processed', {
    receivedEvent: true
  });
  ctx.status = statusCodes.OK;
  ctx.body = response;
};


const updateSubscriptionCard = async ctx => {
  const { subscriptionId, newCardDetails } = ctx.request.body;
  console.log("{incoming request body}", ctx.request.body);
  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: newCardDetails,
  });
  const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
    default_payment_method: paymentMethod.id,
  });
  console.log("updatedSubscription", updatedSubscription);

  let response = new HTTPResponse("card updated successfully!", statusCodes.OK);
  ctx.response = statusCodes.OK
  ctx.body = response
}


module.exports = {
  stripeSubscription,
  userSubscriptionStatus,
  deleteSubscription,
  stripeWebHook,
  updateSubscriptionCard
}
