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

module.exports = { stripeSubscription }
