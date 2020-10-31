const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const httpStatus = require('http-status')

const APIError = require('../utils/APIError')
const { env } = require('../../config/vars')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 128,
      index: true,
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
      index: true,
      required: true
    },
    stockBalance: {
      type: Number,
      index: true,
      required: true
    },
    warehouseId: {
      type: Number,
      index: true,
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

productSchema.plugin(mongoosePaginate)

productSchema.method({
  transform() {
    const transformed = {}
    const fields = [
      'id',
      'name',
      'picture',
      'price',
      'stockBalance',
      'warehouseId',
      'description',
      'createdAt',
      'updatedAt'
    ]
    console.log(this.createdAt)
    fields.forEach(field => (transformed[field] = this[field]))
    return transformed
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
  }
}

/**
 * @typedef Product
 */
module.exports = mongoose.model('Product', productSchema)
