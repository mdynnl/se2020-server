const mongoose = require('mongoose')
const httpStatus = require('http-status')

const APIError = require('../utils/APIError')
const { env } = require('../../config/vars')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 128,
      required: true,
      trim: true
    },
    picture: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    stockBalance: {
      type: Number,
      required: true
    },
    warehouseId: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
)

productSchema.pre('save', async function save(next) {
  try {
    return next()
  } catch (error) {
    return next(error)
  }
})

productSchema.method({
  transform() {
    return [
      'id',
      'name',
      'picture',
      'price',
      'stockBalance',
      'warehouseId',
      'description'
    ].reduce((o, k) => ((o[k] = this[k]), o), {})
  }
})

productSchema.statics = {
  async get(id) {
    try {
      let product
      if (mongoose.Types.ObjectId.isValid(id)) {
        product = await this.findById(id).exec()
      }
      if (product) {
        return product
      }

      throw new APIError({
        message: 'Product does not exist',
        status: httpStatus.NOT_FOUND
      })
    } catch (error) {
      throw error
    }
  },
  list(
    { name = '', price, stockBalance, warehouseId },
    { page = 1, limit = 30 }
  ) {
    
    return this.find({
      ...(warehouseId && {
        warehouseId: {
          $in: [...warehouseId.split(',')]
        }
      }),
      ...(name && { $text: { $search: name } })
    })
      .sort({ createdAt: -1 })
      .skip(limit * (page - 1))
      .limit(+limit)
      .exec()
  }
}

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema)
module.exports = Product
