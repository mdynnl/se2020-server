const mongoose = require('mongoose')
const httpStatus = require('http-status')

const APIError = require('../utils/APIError')
const { env } = require('../../config/vars')

const STATE_VISIBLE = 0
const STATE_TRASHED = 1
const STATE_DELETED = 2

function transform(doc, ret) {
  return [
    'id',
    'name',
    // 'picture',
    'price',
    // 'stockBalance',
    'warehouseId',
    // 'description',
    // 'createdAt',
    // 'updatedAt'
  ].reduce((o, k) => ((o[k] = ret[k]), o), {})
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 128,
      required: true,
      trim: true,
    },
    picture: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stockBalance: {
      type: Number,
      required: true,
    },
    warehouseId: {
      type: Number,
      required: true,
    },
    state: {
      type: Number,
      default: STATE_VISIBLE,
    },
  },
  {
    versionKey: false,
    id: false,
    timestamps: false,
  },
)

productSchema.index({
  name: 'text',
  price: 1,
  stockBalance: 1,
  warehouseId: 1,
  state: 1,
})

// productSchema.pre('save', async function save(next) {
//   try {
//     return next()
//   } catch (error) {
//     return next(error)
//   }
// })

const throwApiError404 = () => {
  throw new APIError({
    message: 'Product does not exist',
    status: httpStatus.NOT_FOUND,
  })
}
productSchema.statics = {
  ...productSchema.statics,
  STATE_VISIBLE,
  STATE_TRASHED,
  STATE_DELETED,
  // don't use this
  async DELETE_FROM_DATABASE(_id) {
    await (await this.GET_FROM_DATABASE(_id)).delete()
  },
  // get
  async GET_FROM_DATABASE(_id) {
    let product
    if (mongoose.Types.ObjectId.isValid(_id)) {
      product = await this.findById(_id).exec()
    }
    if (product) {
      return product
    }
    throwApiError404()
  },

  async getTrashed(_id) {
    let product = await this.GET_FROM_DATABASE(_id)
    if (product.state === STATE_TRASHED) {
      return product
    }
    throwApiError404()
  },
  async getDeleted(_id) {
    let product = await this.GET_FROM_DATABASE(_id)
    if (product.state === STATE_DELETED) {
      return product
    }
    throwApiError404()
  },
  async getVisible(_id) {
    let product = await this.GET_FROM_DATABASE(_id)
    if (product.state === STATE_VISIBLE) {
      return product
    }
    throwApiError404()
  },
  async fromVisibleToTrash(_id) {
    let product = await this.getVisible(_id)
    await this.findOneAndUpdate({ _id }, { state: STATE_TRASHED })
  },
  async fromTrashToVisible(_id) {
    let product = await this.getTrashed(_id)
    await this.findOneAndUpdate({ _id }, { state: STATE_VISIBLE })
  },
  async fromTrashToDeleted(_id) {
    let product = await this.getTrashed(_id)
    await this.findOneAndUpdate({ _id }, { state: STATE_DELETED })
  },
  async fromDeletedToTrash(_id) {
    let product = this.getDeleted(_id)
    await this.findOneAndUpdate({ _id }, { state: STATE_TRASHED })
  },

  // list(
  //   { name = '', price, stockBalance, warehouseId },
  //   { page = 1, limit = 30 }
  // ) {
  //   return this.find({
  //   })
  //     .sort({ createdAt: -1 })
  //     .skip(limit * (page - 1))
  //     .limit(+limit)
  //     .exec()
  // }
}

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema)
module.exports = Product
