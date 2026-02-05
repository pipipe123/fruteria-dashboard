export class Product {
    constructor({
        id,
        name,
        category,
        stock = 0,
        expirationDate,
        createdAt
    }) {
        if(!name) throw new Error('Product name is required')
        if(stock < 0) throw new Error('Stock cannot be negative')

        this.id = id
        this.name = name
        this.category = category
        this.stock = stock
        this.expirationDate = expirationDate
        this.createdAt= createdAt
    }

    increaseStock(quantity) {
        if(quantity <= 0) throw new Error('Quantity must be positive')
        this.stock += quantity
    }

    decreaseStock(quantity) {
    if (quantity <= 0) throw new Error('Quantity must be positive')
    if (this.stock - quantity < 0) {
      throw new Error('Insufficient stock')
    }
    this.stock -= quantity
    }

    isExpired() {
        return new Date(this.expirationDate) < new Date()
    }


    daysToExpire() {
        const today = new Date()
        const exp = new Date(this.expirationDate)
        return Math.ceil((exp - today) / (1000 * 60 * 60 * 24))
    }
}
