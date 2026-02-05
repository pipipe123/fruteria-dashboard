import express from 'express'
import cors from 'cors'
import path from 'path'
import { ProductRepository } from '../infrastructure/repositories/ProductRepositoryJson.js'
import { EntryRepository } from '../infrastructure/repositories/EntryRepositoryJson.js'
import { ExitRepository } from '../infrastructure/repositories/ExitRepositoryJson.js'

const app = express()
app.use(cors())
app.use(express.json())

// Serve frontend static files (frontend is at project root, server runs from backend/)
const frontendPath = path.join(process.cwd(), '..', 'frontend')
app.use(express.static(frontendPath))

// Products
app.get('/api/products', async (req, res) => {
  const rows = await ProductRepository.getAll()
  res.json(rows)
})

// Caducidad: productos vigentes, por caducar, caducados (debe ir antes de /:id)
app.get('/api/products/expiration/status', async (req, res) => {
  const today = new Date().toISOString().slice(0, 10)
  const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const products = await ProductRepository.getAll()

  const vigentes = products
    .filter(p => p.expiration_date > in7Days)
    .sort((a, b) => a.expiration_date.localeCompare(b.expiration_date))
  const porCaducar = products
    .filter(p => p.expiration_date > today && p.expiration_date <= in7Days)
    .sort((a, b) => a.expiration_date.localeCompare(b.expiration_date))
  const caducados = products
    .filter(p => p.expiration_date < today)
    .sort((a, b) => a.expiration_date.localeCompare(b.expiration_date))

  res.json({ vigentes, porCaducar, caducados })
})

app.get('/api/products/:id', async (req, res) => {
  const product = await ProductRepository.getById(req.params.id)
  if (!product) return res.status(404).json({ error: 'Not found' })
  res.json(product)
})

app.post('/api/products', async (req, res) => {
  const { name, stock = 0, expirationDate } = req.body
  if (!name || !expirationDate) return res.status(400).json({ error: 'Missing fields' })
  const created = await ProductRepository.create({ name, stock, expirationDate })
  res.status(201).json(created)
})

app.put('/api/products/:id', async (req, res) => {
  const id = req.params.id
  const { name, stock, expirationDate } = req.body
  const updated = await ProductRepository.updateById(id, { name, stock, expirationDate })
  if (!updated) return res.status(404).json({ error: 'Not found' })
  res.json(updated)
})

app.delete('/api/products/:id', async (req, res) => {
  await ProductRepository.delete(req.params.id)
  res.status(204).end()
})

// Entries
app.post('/api/entries', async (req, res) => {
  const { productId, quantity } = req.body
  if (!productId || !quantity) return res.status(400).json({ error: 'Missing fields' })
  const entry = await EntryRepository.create({ productId, quantity })
  const product = await ProductRepository.getById(productId)
  await ProductRepository.update(productId, product.stock + quantity)
  res.status(201).json(entry)
})

// Exits
app.post('/api/exits', async (req, res) => {
  const { productId, quantity } = req.body
  if (!productId || !quantity) return res.status(400).json({ error: 'Missing fields' })
  const product = await ProductRepository.getById(productId)
  if (!product) return res.status(404).json({ error: 'Product not found' })
  if (product.stock < quantity) return res.status(400).json({ error: 'Insufficient stock' })
  const exit = await ExitRepository.create({ productId, quantity })
  await ProductRepository.update(productId, product.stock - quantity)
  res.status(201).json(exit)
})

// Dashboard
app.get('/api/dashboard', async (req, res) => {
  const products = await ProductRepository.getAll()
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0)

  const today = new Date().toISOString().slice(0, 10)
  const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

  const expiring = products
    .filter(p => p.expiration_date >= today && p.expiration_date <= in7Days)
    .sort((a, b) => a.expiration_date.localeCompare(b.expiration_date))
    .slice(0, 10)

  const expired = products
    .filter(p => p.expiration_date < today)
    .sort((a, b) => a.expiration_date.localeCompare(b.expiration_date))
    .slice(0, 10)

  const entries = await EntryRepository.getRecent()
  const exits = await ExitRepository.getRecent()

  res.json({ totalStock, expiring, expired, entries, exits })
})

// Fallback to index para SPA (Express 5: wildcard requiere parámetro nombrado)
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'))
})
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'))
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on port ${port}`))
