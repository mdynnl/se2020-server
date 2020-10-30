const express = require('express')
const router = express.Router()

router.get('/', (req, res) => res.send('OK'))
router.get('/warehouses', (req, res) => {
  res.json(
    Array(10)
      .fill(0)
      .map((_, i) => ({
        id: i + 1,
        name: `Warehouses${i + 1}`
      }))
  )
})
module.exports = router
