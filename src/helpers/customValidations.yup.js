const yup = require('yup')
const statusCodes = require('http-status-codes')

const stripeSubscriptionValidation = async (ctx, next) => {
  const schema = yup.object({
    priceId: yup.string().required('priceId is required!')
  })

  try {
    await schema.validate(ctx.request.body, { abortEarly: false })
    console.log('Validation passed!')
    await next()
  } catch (error) {
    ctx.status = statusCodes.BAD_REQUEST
    ctx.body = { errors: error.errors }
  }
}

const userStatusValidation = async (ctx, next) => {
  const schema = yup.object({
    subscriptionId: yup.string().required('subscriptionId is required!')
  })

  try {
    await schema.validate(ctx.request.body, { abortEarly: false })
    console.log('Validation passed!')
    await next()
  } catch (error) {
    ctx.status = statusCodes.BAD_REQUEST
    ctx.body = { errors: error.errors }
  }
}

const deleteSubscriptionValidation = async (ctx, next) => {
  const schema = yup.object({
    subscriptionId: yup.string().required('subscriptionId is required!')
  })

  try {
    await schema.validate(ctx.request.body, { abortEarly: false })
    console.log('Validation passed!')
    await next()
  } catch (error) {
    ctx.status = statusCodes.BAD_REQUEST
    ctx.body = { errors: error.errors }
  }
}

const updateSubscriptionCardValidation = async (ctx, next) => {
  const schema = yup.object({
    subscriptionId: yup.string().required('subscriptionId is required!'),
    newCardDetails: yup.string().required('newCardDetails are required')
  })

  try {
    await schema.validate(ctx.request.body, { abortEarly: false })
    console.log('Validation passed!')
    await next()
  } catch (error) {
    ctx.status = statusCodes.BAD_REQUEST
    ctx.body = { errors: error.errors }
  }
}

module.exports = {
  stripeSubscriptionValidation,
  userStatusValidation,
  deleteSubscriptionValidation,
  updateSubscriptionCardValidation
}
