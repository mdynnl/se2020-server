const faker = require('faker')
const Product = require('../models/product.model')
const count = 30
const feed = async con => {
  const warehouses = await (await fetch(process.env.WAREHOUSE_API)).json()
  console.log('fetched warehouse list')
  const warehouseIds = warehouses.map(w => w.id)
  const createOne = () =>
    new Product({
      name: faker.commerce.productName(),
      picture: faker.image.business(500, 500),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      stockBalance: faker.commerce.price(),
      warehouseId: faker.random.arrayElement(warehouseIds),
    }).save()
  await Promise.all(Array(count).fill(0).map(createOne))
  console.log(`created ${count} product items`)
}

const dropDb = async con => {
  await con.dropDatabase()
  console.log('dropped database')
}

module.exports = {
  dropDb,
  feed,
}
