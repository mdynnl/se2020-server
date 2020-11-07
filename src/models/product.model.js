const mongoose = require('mongoose')
const mongooseDelete = require('mongoose-delete')

function transform(doc, ret) {
  const {
    _id: id,
    name,
    picture,
    price,
    stockBalance,
    warehouseId,
    description,
  } = ret
  return {
    id,
    name,
    picture,
    price,
    stockBalance,
    warehouseId,
    description,
  }
}

const toJSON = { transform }
const toObject = toJSON

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
  },
  { versionKey: false, timestamps: true, toJSON, toObject },
)

productSchema.index({
  name: 'text',
  price: 1,
  stockBalance: 1,
  warehouseId: 1,
})

productSchema.plugin(mongooseDelete, {
  overrideMethods: ['count', 'find', 'findOne', 'findOneAndUpdate'],
})

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema)
module.exports = Product
