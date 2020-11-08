require('dotenv').config()
const { WAREHOUSE_API } = process.env
const fetch = require('isomorphic-fetch')

const list = async () => {
  const res = await fetch(WAREHOUSE_API)
  const warehouses = await res.json()
  return warehouses
}

const get = async id => {
  const warehouses = await list()
  return warehouses.find(w => w.id === id)
}
module.exports = { list, get }
