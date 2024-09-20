const statusCodes = require('http-status-codes')
const { HTTPResponse } = require('../helpers/response.helper')
const stripe = require('stripe')(process.env.STRIPE_SECRET)

const stripeSubscription = async ctx => {
  let response;
  const { priceId } = ctx.request.body;
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
    });
    // console.log('Session:', session);
    response = new HTTPResponse('Session created successfully!', session.url);
    ctx.status = statusCodes.CREATED;
    ctx.body = response;
};

const userSubscriptionStatus = async ctx =>{
  const { subscriptionId } = ctx.request.body;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  // console.log("subscription status", subscription.status);
  let response = new HTTPResponse("subscription retrieved successfully!", {subscriptionStatus:subscription.status});
  // console.log("response", response);
  ctx.status = statusCodes.OK;
  ctx.body = response;
}

const deleteSubscription = async ctx =>{
  const { subscriptionId } = ctx.request.body;
  const cancelSubscription = await stripe.subscriptions.cancel(subscriptionId, {
    prorate: false // You can set this to true if you want prorated refunds
  });
  // console.log("subscription cancelled!", cancelSubscription)
  let response = new HTTPResponse("subscription cancelled successfully!", cancelSubscription)
  ctx.status = statusCodes.OK;
  ctx.body = response
}


module.exports = { stripeSubscription, userSubscriptionStatus, deleteSubscription }
