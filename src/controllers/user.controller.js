const User = require('../models/user.model')
const { HTTPResponse } = require('../helpers/response.helper')
const generateHashPassword = require("../helpers/bcrypt.helper")

const getAllUsers = async ctx => {
  const users = await User.findAll()
  const response = new HTTPResponse('Operation completed successfully', users)
  ctx.status = StatusCodes.OK
  ctx.body = response
}

const registerMe = async ctx => {
  let error, response
  const { userName, email, password } = ctx.request.body

  const user = await User.findOne({ where: { email } })
  if (user) {
    error = new HTTPError(
      'User exists, try logging in!',
      StatusCodes.BAD_REQUEST
    )
    ctx.status = StatusCodes.BAD_REQUEST
    ctx.body = error
    return
  }

  const hashedPassword = await generateHashPassword(password)
  console.log('Password hashed------------------>', hashedPassword)

  const newUser = await User.create({
    user_name: userName,
    email: email,
    password: hashedPassword,
    role: 'admin'
  })
  console.log(newUser, 'User created successfully!!!!!!!!')

  response = new HTTPResponse('User created successfully!', newUser)
  ctx.status = StatusCodes.OK
  ctx.body = response
}

module.exports = {
  getAllUsers,
  registerMe
}
