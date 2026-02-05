import { pool } from './connection.js'

async function test() {
  const res = await pool.query('SELECT NOW()')
  console.log('Conectado a PostgreSQL:', res.rows[0])
  process.exit(0)
}

test()
