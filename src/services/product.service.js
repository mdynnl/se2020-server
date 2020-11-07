const Product = require('../models/product.model')
const warehouseService = require('./warehouse.service')

const create = async (fields = {}) => {
  const warehouses = await warehouseService.list()
  const ids = warehouses.map(w => w.id)

  const { warehouseId } = fields
  if (!ids.includes(warehouseId)) return null

  const item = new Product(fields)
  const savedItem = await item.save()
  if (savedItem) {
    const warehouse = warehouses.find(w => w.id === savedItem.warehouseId)
    return { ...savedItem.toObject(), warehouse }
  }
  return null
}

const get = async _id => {
  const warehouses = await warehouseService.list()
  const ids = warehouses.map(w => w.id)
  const item = await Product.findOne({ _id, warehouseId: { $in: ids } })

  if (item) {
    const warehouse = warehouses.find(w => w.id === item.warehouseId)
    return { ...item.toObject(), warehouse }
  }
  return null
}

const update = async (_id, fields) => {
  const warehouses = await warehouseService.list()
  const ids = warehouses.map(w => w.id)

  const item = await Product.findOneAndUpdate(
    {
      _id,
      warehouseId: { $in: ids },
    },
    { ...fields },
    { new: true },
  )

  if (item) {
    const warehouse = warehouses.find(w => w.id === item.warehouseId)
    return { ...item.toObject(), warehouse }
  }
  return null
}

const remove = async _id => {
  const warehouses = await warehouseService.list()
  const ids = warehouses.map(w => w.id)

  const result = await Product.delete({ _id, warehouseId: { $in: ids } })
  return result.n === 1
}

const restore = async _id => {
  const warehouses = await warehouseService.list()
  const ids = warehouses.map(w => w.id)

  const result = await Product.restore({ _id, warehouseId: { $in: ids } })
  return result.n === 1
}

const listRemoved = async () => {
  const warehouses = await warehouseService.list()
  const ids = warehouses.map(w => w.id)

  const items = await Product.findDeleted({ warehouseId: { $in: ids } })

  return items.map(item => {
    const warehouse = warehouses.find(w => w.id === item.warehouseId)
    return { ...item.toObject(), warehouse }
  })
}

const list = async (fields = {}) => {
  const warehouses = await warehouseService.list()
  const ids = warehouses.map(w => w.id)

  let query = { warehouseId: { $in: ids } }
  let { name } = fields
  if (name) {
    delete fields.name
    query = { $text: { $search: name }, ...fields, ...query }
  }

  const items = await Product.find(query).sort({ createdAt: -1 })

  return items.map(item => {
    const warehouse = warehouses.find(w => w.id === item.warehouseId)
    return { ...item.toObject(), warehouse }
  })
}

module.exports = { create, get, update, remove, restore, list, listRemoved }
