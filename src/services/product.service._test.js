require('dotenv').config()
const { mongoose } = require('../app')
const { dropDb } = require('../scripts/db')
const {
  create,
  get,
  list,
  listRemoved,
  remove,
  restore,
  update,
} = require('./product.service')

const warehouseService = require('./warehouse.service')
let warehouses
beforeAll(async () => {
  warehouses = await warehouseService.list()
})

// dropDb before tests
beforeAll(done => mongoose.connect().then(dropDb).finally(done))
afterAll(done => mongoose.disconnect(done))
// beforeEach(async () => await mongoose.connect())
// afterEach(async () => await mongoose.disconnect())

// .then(async () => {
// })
// .finally(mongoose.disconnect)

describe('Test [Service] Product', () => {
  test('[list] should return an empty array', async () => {
    const res = await list()
    expect(res).toEqual([])
  })

  let createdProduct

  test('[create] should create a product with first warehouse id', async () => {
    let firstWarehouse = warehouses[0]
    let productToCreate = {
      name: 'hello',
      picture: 'https://picsum.photos/200',
      description: 'hello description',
      price: 99999999,
      stockBalance: 99999999,
    }
    createdProduct = await create({
      ...productToCreate,
      warehouseId: firstWarehouse.id,
    })

    expect(createdProduct).toBeTruthy()
    expect(createdProduct).toMatchObject(productToCreate)
    expect(createdProduct.warehouse).toMatchObject(firstWarehouse)
  })

  test('[get] should return created product', async () => {
    const returnedProduct = await get(createdProduct.id)
    expect(returnedProduct).toBeTruthy()
    expect(returnedProduct).toMatchObject(createdProduct)
  })

  test('[list] should return an array with created product', async () => {
    const res = await list()
    expect(res).toBeTruthy()
    expect(res).toHaveLength(1)
    expect(res[0]).toMatchObject(createdProduct)
  })

  let updatedProduct
  test('[update] should update product with new values', async () => {
    let lastWarehouse = warehouses[warehouses.length - 1]
    let productWithNewValues = {
      name: 'updated hello',
      description: 'updated hello description',
      price: 11111111,
      stockBalance: 11111111,
    }
    updatedProduct = await update(createdProduct.id, {
      ...productWithNewValues,
      warehouseId: lastWarehouse.id,
    })

    expect(updatedProduct).toBeTruthy()
    expect(updatedProduct).toMatchObject(productWithNewValues)
    expect(updatedProduct.warehouse).toMatchObject(lastWarehouse)
  })

  test('[get] should return updated product', async () => {
    const returnedProduct = await get(updatedProduct.id)
    expect(returnedProduct).toBeTruthy()
    expect(returnedProduct).toMatchObject(updatedProduct)
  })

  test('[list] should return an array with updated product', async () => {
    const res = await list()
    expect(res).toBeTruthy()
    expect(res).toHaveLength(1)
    expect(res[0]).toMatchObject(updatedProduct)
  })

  test('[remove] should remove update product', async () => {
    const res = await remove(updatedProduct.id)
    expect(res).toBeTruthy()
  })

  test('[get] should not return removed product', async () => {
    const returnedProduct = await get(updatedProduct.id)
    expect(returnedProduct).toBeFalsy()
  })

  test('[list] should return an empty array', async () => {
    const res = await list()
    expect(res).toBeTruthy()
    expect(res).toHaveLength(0)
  })

  test('[listRemoved] should return an array with deleted product', async () => {
    const res = await listRemoved()
    expect(res).toBeTruthy()
    expect(res).toHaveLength(1)
    expect(res[0]).toMatchObject(updatedProduct)
  })

  test('[restore] should restore the deleted product', async () => {
    const res = await restore(updatedProduct.id)
    expect(res).toBeTruthy()
  })

  test('[listRemoved] should return an empty array', async () => {
    const res = await listRemoved()
    expect(res).toBeTruthy()
    expect(res).toHaveLength(0)
  })

  test('[get] should return the restored product', async () => {
    const returnedProduct = await get(updatedProduct.id)
    expect(returnedProduct).toBeTruthy()
    expect(returnedProduct).toMatchObject(updatedProduct)
  })

  test('[list] should return an array with restored product', async () => {
    const res = await list()
    expect(res).toBeTruthy()
    expect(res).toHaveLength(1)
    expect(res[0]).toMatchObject(updatedProduct)
  })
})
