const httpStatus = require('http-status')
const service = require('../services/warehouse.service')

const list = async (req, res, next) => {
  res.json(await service.list())
}

const get = async (req, res, next) => {
  const { id } = req.params
  res.json(await service.get(+id))
}

module.exports = { list, get }
