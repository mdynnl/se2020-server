const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compress = require('compression')
const methodOverride = require('method-override')
const cors = require('cors')
const helmet = require('helmet')

const productRoutes = require('../routes/v1/product.route')
const warehouseRoutes = require('../routes/v1/warehouse.route')
const { logs, API } = require('./vars')
const error = require('../middlewares/error')

const app = express()

app.set('json escape', true)
app.set('json spaces', 2)
app.set('query parser', 'extended')
app.set('x-powered-by', false)

app.use(morgan(logs))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(compress())
app.use(methodOverride())
app.use(helmet())
app.use(cors())

app.use(API.PRODUCTS, productRoutes)
app.use(API.WAREHOUSES, warehouseRoutes)

app.use(error.converter)
app.use(error.notFound)
app.use(error.handler)

module.exports = app
