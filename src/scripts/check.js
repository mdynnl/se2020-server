require('dotenv').config()
const fetch = require('isomorphic-fetch')
const { mongoose } = require('../app')
let { WAREHOUSE_API, FILE_API } = process.env
console.log('running pretest checks')

console.log('checking servers: WarehouseAPI, MongoDB')
fetch(WAREHOUSE_API)
  .then(() => console.log('WarehouseAPI connected...'))
  .catch(err => {
    if (err.code === 'ECONNREFUSED') {
      console.error('WarehouseAPI: failed to connect...')
      process.exit(1)
    }
  })
  
mongoose.connect().finally(mongoose.disconnect)
