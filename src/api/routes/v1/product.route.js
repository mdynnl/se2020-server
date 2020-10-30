const express = require('express')
const validate = require('express-validation')
const validation = require('../../validation')
const controller = require('../../controllers/product.controller')
const router = express.Router()
router
  .route('/')
  /** */
  .get(controller.list)
  /** */
  .post(controller.create)
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
