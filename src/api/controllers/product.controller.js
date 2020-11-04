const httpStatus = require('http-status')
const faker = require('faker')

const Product = require('../models/product.model')
const { STATE_VISIBLE, STATE_TRASHED, STATE_DELETED } = Product
const APIError = require('../utils/APIError')

const list = async (req, res, next) => {
  try {
    // const { page, limit, name, price, stockBalance, warehouseId } = req.query

    // const query = { name, price, stockBalance, warehouseId }
    // const products = await Product.list(query, { page, limit })
    // const transformedProducts = products.map(p => p.transform())
    // res.json(transformedProducts)
    const query = Product.find(
      {
        $text: {
          $search: 'Awesome Plastic Soap',
        },
        state: 1,
      },
      { name: 1, state: 1 },
      { lean: true, limit: 3 },
    )

    const total = await Product.estimatedDocumentCount()
    const data = await query.exec()
    const count = await query.countDocuments()
    res.json({ count, total, data })
  } catch (err) {
    next(err)
  }
}
const create = async (req, res, next) => {
  try {
    const product = await new Product(req.body).save()
    const location = `/api/v1/products/${product.id}`
    res
      .status(httpStatus.CREATED)
      .location(location)
      .json({ message: 'Product was created successfully', location })
  } catch (err) {
    next(err)
  }
}
const get = async (req, res, next) => {
  try {
    const { _id } = req.params
    let { level = 0 } = req.query
    console.log(_id, level)
    let product
    if (level == Product.STATE_VISIBLE) {
      product = await Product.getVisible(_id)
    } else if (level == Product.STATE_TRASHED) {
      product = await Product.getTrashed(_id)
    }
    res.json(product)
  } catch (err) {
    next(err)
  }
}
const remove = async (req, res, next) => {
  try {
    const { _id } = req.params
    // const { level = 1 } = req.body
    console.log(_id)
    await Product.fromVisibleToTrash(_id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}
const update = async (req, res, next) => {
  try {
    const { _id } = req.params
    const product = await Product.getVisible(_id)
    await Product.findOneAndUpdate({ _id }, req.body)
    const updatedProduct = await Product.get(_id)
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
          warehouseId: faker.random.number({ min: 1, max: 10 }),
        }).save(),
      ),
  )
  res.json({
    message: 'gochisosamadeshita',
  })
}

module.exports = { list, create, get, remove, update, feed }
