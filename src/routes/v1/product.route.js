const express = require('express')
const controller = require('../../controllers/product.controller')
const router = express.Router()

// route order are important
router
  .route('/')
  /** */
  .get(controller.list)
  /** */
  .post(controller.create)
router.route('/trash').get(controller.trash)
router
  .route('/:id')
  /** */
  .get(controller.get)
  /** */
  .delete(controller.remove)
  /** */
  .patch(controller.update)

router.route('/:id/restore').patch(controller.restore)

module.exports = router
