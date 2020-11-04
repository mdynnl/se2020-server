const express = require('express')
const httpStatus = require('http-status')
const APIError = require('../api/utils/APIError')
const router = express.Router()

const warehouses = require('./warehouses')

router.get('/', (req, res) => res.send('OK'))
router.get('/warehouses', (req, res) => {
  res.json(warehouses.list())
})

router.get('/warehouses/:id', (req, res) => {
  const { id } = req.params
  const warehouse = warehouses.get(id)
  if (warehouse) return res.json(warehouse)

  throw new APIError({
    message: 'Product does not exist',
    status: httpStatus.NOT_FOUND
  })
})
module.exports = router
