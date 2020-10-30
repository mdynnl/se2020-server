const httpStatus = require('http-status')

const Product = require('../models/product.model')

const list = async (req, res, next) => {
  try {
    const products = await Product.list(req.query)
    const transformedProducts = products.map(p => p.transform())
    res.json(transformedProducts)
  } catch (err) {
    next(err)
  }
}
const create = async (req, res, next) => {
  try {
    const product = new Product(req.body)
    const savedProduct = await product.save()
    res.status(httpStatus.CREATED)
    res.json(savedProduct.transform())
  } catch (err) {
    next(err)
  }
}
const get = async (req, res, next) => {
  try {
    const { productId } = req.params
    const product = await Product.get(productId)
    res.json(product.transform())
  } catch (err) {
    next(err)
  }
}
const remove = async (req, res, next) => {
  try {
    const { productId } = req.params
    const product = await Product.get(productId)
    const removedProduct = await product.remove()
    res.json(removedProduct.transform())
  } catch (err) {
    next(err)
  }
}
const update = async (req, res, next) => {
  try {
    const { productId } = req.params
    const fields = ['name', 'picture', 'price', 'stockBalance', 'warehouseId']
    const newFields = {}
    const product = await Product.get(productId)

    fields.forEach(f => {
      const v = req.body[f]
      if (v !== null && v !== undefined) {
        newFields[f] = v
      }
    })

    await Product.findByIdAndUpdate({ _id: productId }, newFields)

    const updatedProduct = await Product.get(productId)
    res.json(updatedProduct.transform())
  } catch (err) {
    next(err)
  }
}

module.exports = { list, create, get, remove, update }
