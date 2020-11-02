const httpStatus = require('http-status')
const { ValidationError } = require('express-validation')
const APIError = require('../utils/APIError')
const { env } = require('../../config/vars')

const handler = (err, req, res, next) => {
  const response = {
    code: err.status,
    message: err.message || httpStatus[err.status],
    errors: err.errors,
    stack: err.stack
  }

  if (env !== 'development') {
    delete response.stack
  }

  res.status(err.status)
  res.json(response)
}

const converter = (err, req, res, next) => {
  let convertedError = err

  if (err instanceof ValidationError) {
    convertedError = new APIError({
      message: `${err.error}: ${err.name}`,
      errors: err.details,
      status: err.statusCode,
      stack: err.stack
    })
  } else if (!(err instanceof APIError)) {
    convertedError = new APIError({
      message: err.message,
      status: err.status,
      stack: err.stack
    })
  }

  return handler(convertedError, req, res)
}

const notFound = (req, res, next) => {
  const err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND
  })
  return handler(err, req, res)
}

module.exports = { handler, converter, notFound }
