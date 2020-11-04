const express = require('express')
const { env, feedmepass } = require('../../../config/vars')
const controller = require('../../controllers/product.controller')
const router = express.Router()

// todo: validation
router
  .route('/')
  /** */
  .get(controller.list)
  /** */
  .post(controller.create)

router.route('/search').get(controller.search)

const saytheword = ({ query: { pass } }, res, next) => {
  if (pass === feedmepass) return next()
  res.json({
    message: 'so, you wanted to feed me ;-)',
  })
}

router.route('/feedme').get(saytheword, controller.feed)

// this must be the last
router
  .route('/:_id')
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
