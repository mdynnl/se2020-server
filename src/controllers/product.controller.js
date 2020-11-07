const httpStatus = require('http-status')
const service = require('../services/product.service')
const { API } = require('../config/vars')

const list = async (req, res, next) => {
  try {
    const result = await service.list()
    res.json(result)
  } catch (e) {
    next(e)
  }
}
const trash = async (req, res, next) => {
  try {
    const result = await service.listRemoved()
    res.json(result)
  } catch (e) {
    next(e)
  }
}
const create = async (req, res, next) => {
  try {
    const fields = req.body
    const result = await service.create(fields)
    if (!result) return res.status(httpStatus.NOT_FOUND).end()
    res.status(httpStatus.CREATED).json({
      url: `${API.PRODUCTS}/${result.id}`,
      message: 'Product was successfully created',
    })
  } catch (e) {
    next(e)
  }
}
const get = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await service.get(id)
    if (!result) return res.status(httpStatus.NOT_FOUND).end()
    res.json(result)
  } catch (e) {
    next(e)
  }
}
const remove = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await service.remove(id)
    if (!result) return res.status(httpStatus.NOT_FOUND).end()
    res.status(httpStatus.NO_CONTENT).end()
  } catch (e) {
    next(e)
  }
}
const restore = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await service.restore(id)
    if (!result) return res.status(httpStatus.NOT_FOUND).end()
    res.status(httpStatus.NO_CONTENT).end()
  } catch (e) {
    next(e)
  }
}
const update = async (req, res, next) => {
  try {
    const { id } = req.params
    const fields = req.body
    const result = await service.update(id, fields)
    if (!result) return res.status(httpStatus.NOT_FOUND).end()
    res.status(httpStatus.NO_CONTENT).end()
  } catch (e) {
    next(e)
  }
}

module.exports = { list, trash, create, get, remove, restore, update }
