require('dotenv').config()
const fetch = require('isomorphic-fetch')
const warehouseService = require('./warehouse.service')
let { WAREHOUSE_API } = process.env
let warehouses
beforeEach(async () => {
  warehouses = await (await fetch(WAREHOUSE_API)).json()
})
describe('Test [Server] Warehouse', () => {
  test('should be running', () => {
    expect(warehouses).toBeTruthy()
  })
})
describe('Test [Service] Warehouse', () => {
  test('should return available warehouse list', async () => {
    const res = await warehouseService.list()
    expect(res).toEqual(warehouses)
  })

  test(`should return the first warehouse`, async () => {
    const [warehouse] = warehouses
    const res = await warehouseService.get(warehouse.id)
    expect(res).toEqual(warehouse)
  })
})
