import { pool } from '../database/connection.js'

export const ProductRepository = {
    getAll: async () => {
        const { rows }= await pool.query('SELECT * FROM products' )
        return rows
    },
    
    
    getById: async (id) => {
        const { rows }= await pool.query(
            'SELECT * FROM products WHERE id = $1',[id]
        )
        return rows[0]
    },

    create: async ({ name, stock, expirationDate }) => {
        const { rows } = await pool.query(
            `INSERT INTO products (name, stock, expiration_date)
            VALUES ($1, $2, $3) RETURNING *`,
            [name, stock, expirationDate]
        )
        return rows[0]
    },
    
    update: async (id, stock) => {
        const { rows } = await pool.query(
        `UPDATE products SET stock = $1 WHERE id = $2 RETURNING *`,
        [stock, id]
        )
        return rows[0]
    },

    updateById: async (id, { name, stock, expirationDate }) => {
        const { rows } = await pool.query(
            `UPDATE products SET name = $1, stock = $2, expiration_date = $3 WHERE id = $4 RETURNING *`,
            [name, stock, expirationDate, id]
        )
        return rows[0]
    },

    delete: async (id) => {
        await pool.query('DELETE FROM products WHERE id = $1', [id])
    }
}