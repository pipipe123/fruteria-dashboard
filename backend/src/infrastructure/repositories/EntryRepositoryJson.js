import { jsonStore } from '../database/jsonStore.js'

export const EntryRepository = {
  create: async ({ productId, quantity }) => {
    const data = jsonStore.read()
    const entry = {
      id: data.nextEntryId++,
      product_id: productId,
      quantity,
      date: new Date().toISOString()
    }
    data.entries.push(entry)
    jsonStore.write(data)
    return entry
  },

  getRecent: async () => {
    const data = jsonStore.read()
    const recent = data.entries
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
    return recent.map(e => {
      const product = data.products.find(p => p.id === e.product_id)
      return { ...e, product_name: product?.name }
    })
  }
}
