const warehouses = Array(10)
  .fill(0)
  .map((_, i) => ({
    id: i + 1,
    name: `Warehouse ${i + 1}`
  }))

module.exports = {
  list() {
    return warehouses
  },
  get(id) {
    return warehouses.find(w => w.id == id)
  }
}
