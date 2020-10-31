const express = require('express')
const { env } = require('../../../config/vars')
// const { validate, ValidationError, Joi } = require('express-validation')
// const validation = require('../../validation')
const controller = require('../../controllers/product.controller')
const router = express.Router()

/*
const listProducts = {
  query: {
    page: Joi.number().optional().default(1),
    count: Joi.number().optional().default(30),
    name: Joi.string().optional(),
    price: Joi.number().optional(),
    stockBalance: Joi.number().optional(),
    warehouseId: Joi.number().optional()
  }
}
*/

// todo: validation
router
  .route('/')
  /** */
  .get(controller.list)
  /** */
  .post(controller.create)

const saytheword = ({ query: { pass } }, res, next) => {
  if (pass === 'alohomora') return next()
  res.json({
    message: 'so you want to get in ;-)'
  })
}

router.route('/feedme').get(saytheword, controller.feed)

router
  .route('/:productId')
  /** */
  .get(controller.get)
  /** */
  .delete(controller.remove)
  /** */
  .put(controller.update)
  /** */
  .patch(controller.update)
  /** */
  .post(controller.update)

module.exports = router
