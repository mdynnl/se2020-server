const path = require('path')

require('dotenv-safe').config({
  path: path.join(__dirname, '../../.env'),
  example: path.join(__dirname, '../../.env.example')
})

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  feedmepass: process.env.FEEDMEPASS,
  mongo: {
    uri:
      process.env.NODE_ENV === 'test'
        ? process.env.MONGO_URI_TESTS
        : process.env.MONGO_URI
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
}
