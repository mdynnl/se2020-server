const mongoose = require('mongoose')
const logger = require('./logger')
const { mongo, env } = require('./vars')

mongoose.Promise = Promise

mongoose.connection.on('error', err => {
  logger.error(`MongoDB connection error: ${err}`)
  process.exit(-1)
})

if (env === 'development') {
  mongoose.set('debug', true)
}

const connect = () => {
  mongoose
    .connect(mongo.uri, {
      useCreateIndex: true,
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB connected...'))

  return mongoose.connection
}

module.exports = { connect }
