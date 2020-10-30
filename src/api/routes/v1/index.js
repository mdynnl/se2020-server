const express = require('express')
const router = express.Router()

const productRoutes = require('./product.route')

router.get('/', (req, res) => res.send('OK'))
router.use('/products', productRoutes)
module.exports = router
