require('dotenv-safe').config()
const fetch = require('isomorphic-fetch')
const { mongoose } = require('../app')
const { feed } = require('./db')
mongoose.connect().then(feed).finally(mongoose.disconnect)
