const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compress = require('compression')
const methodOverride = require('method-override')
const cors = require('cors')
const helmet = require('helmet')

const routes = require('../api/routes/v1')
const foreignRoute = require('../api/routes/foreign')
const { logs } = require('./vars')
const error = require('../api/middlewares/error')

const app = express()

app.set('json escape', true)
app.set('json spaces', 2)
app.set('x-powered-by', false)

app.use(morgan(logs))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(compress())
app.use(methodOverride())
app.use(helmet())
app.use(cors())

app.use('/v1', routes)
app.use('/foreign', foreignRoute)

app.use(error.converter)
app.use(error.notFound)
app.use(error.handler)

module.exports = app
