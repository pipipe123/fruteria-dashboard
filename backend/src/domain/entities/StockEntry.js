export class StockEntry {
  constructor({ id, productId, quantity, createdAt }) {
    if (quantity <= 0) {
      throw new Error('Entry quantity must be positive')
    }

    this.id = id
    this.productId = productId
    this.quantity = quantity
    this.createdAt = createdAt
  }
}
