const mongoose = require('mongoose')
const { mongo, env } = require('./vars')

mongoose.Promise = Promise

mongoose.connection.on('error', err => {
  console.error(`MongoDB connection error: ${err}`)
  process.exit(-1)
})

if (env === 'development') {
  mongoose.set('debug', true)
}

const connect = async () => {
  await mongoose.connect(mongo.uri, {
    useCreateIndex: true,
    useFindAndModify: false,
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('MongoDB connected...')
  return mongoose.connection
}

const disconnect = async done => {
  await mongoose.disconnect()
  console.log('MongoDB disconnected...')
  typeof done === 'function' && done()
}

module.exports = { connect, disconnect }
