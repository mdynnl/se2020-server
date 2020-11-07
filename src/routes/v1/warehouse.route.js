const express = require('express')
const controller = require('../../controllers/warehouse.controller')
const router = express.Router()

router.route('/').get(controller.list)
router.route('/:id').get(controller.get)

module.exports = router
