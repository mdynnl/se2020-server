const httpStatus = require('http-status')
const faker = require('faker')

const Product = require('../models/product.model')

const list = async (req, res, next) => {
  try {
    const { page, limit, name, price, stockBalance, warehouseId } = req.query
    // return res.json(page)
    const query = { name, price, stockBalance, warehouseId }
    const products = await Product.list(query, { page, limit })
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

const feed = async (req, res, next) => {
  await Promise.all(
    Array(30)
      .fill(0)
      .map(() =>
        new Product({
          name: faker.commerce.productName(),
          picture: faker.image.business(500, 500),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price(),
          stockBalance: faker.commerce.price(),
          warehouseId: faker.random.number({ min: 1, max: 10 })
        }).save()
      )
  )
  res.json({
    message: 'gochisosamadeshita'
  })
}

module.exports = { list, create, get, remove, update, feed }
