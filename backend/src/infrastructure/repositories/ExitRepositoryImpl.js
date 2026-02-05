import { pool } from '../database/connection.js'

export const ExitRepository = {
  create: async ({ productId, quantity }) => {
    const { rows } = await pool.query(
      `INSERT INTO exits (product_id, quantity)
       VALUES ($1, $2) RETURNING *`,
      [productId, quantity]
    )
    return rows[0]
  },

  getRecent: async () => {
    const { rows } = await pool.query(
      'SELECT * FROM exits ORDER BY date DESC LIMIT 5'
    )
    return rows
  }
}
