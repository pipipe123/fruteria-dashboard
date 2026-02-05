export class StockExit {
  constructor({ id, productId, quantity, reason, createdAt }) {
    if (quantity <= 0) {
      throw new Error('Exit quantity must be positive')
    }

    this.id = id
    this.productId = productId
    this.quantity = quantity
    this.reason = reason
    this.createdAt = createdAt
  }
}
