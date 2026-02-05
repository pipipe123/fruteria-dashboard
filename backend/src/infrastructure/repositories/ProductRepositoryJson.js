import { jsonStore } from '../database/jsonStore.js'

export const ProductRepository = {
  getAll: async () => {
    const data = jsonStore.read()
    return data.products
  },

  getById: async (id) => {
    const data = jsonStore.read()
    const numId = Number(id)
    return data.products.find(p => p.id === numId) || null
  },

  create: async ({ name, stock, expirationDate }) => {
    const data = jsonStore.read()
    const product = {
      id: data.nextProductId++,
      name,
      stock: stock ?? 0,
      expiration_date: expirationDate
    }
    data.products.push(product)
    jsonStore.write(data)
    return product
  },

  update: async (id, stock) => {
    const data = jsonStore.read()
    const numId = Number(id)
    const idx = data.products.findIndex(p => p.id === numId)
    if (idx === -1) return null
    data.products[idx].stock = stock
    jsonStore.write(data)
    return data.products[idx]
  },

  updateById: async (id, { name, stock, expirationDate }) => {
    const data = jsonStore.read()
    const numId = Number(id)
    const idx = data.products.findIndex(p => p.id === numId)
    if (idx === -1) return null
    if (name !== undefined) data.products[idx].name = name
    if (stock !== undefined) data.products[idx].stock = stock
    if (expirationDate !== undefined) data.products[idx].expiration_date = expirationDate
    jsonStore.write(data)
    return data.products[idx]
  },

  delete: async (id) => {
    const data = jsonStore.read()
    const numId = Number(id)
    data.products = data.products.filter(p => p.id !== numId)
    jsonStore.write(data)
  }
}
