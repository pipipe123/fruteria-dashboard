import { jsonStore } from '../database/jsonStore.js'

export const ExitRepository = {
  create: async ({ productId, quantity }) => {
    const data = jsonStore.read()
    const exit = {
      id: data.nextExitId++,
      product_id: productId,
      quantity,
      date: new Date().toISOString()
    }
    data.exits.push(exit)
    jsonStore.write(data)
    return exit
  },

  getRecent: async () => {
    const data = jsonStore.read()
    const recent = data.exits
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
    return recent.map(e => {
      const product = data.products.find(p => p.id === e.product_id)
      return { ...e, product_name: product?.name }
    })
  }
}
