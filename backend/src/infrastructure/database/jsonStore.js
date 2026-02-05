/**
 * Base de datos falsa en JSON - almacenamiento en archivo data.json
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_PATH = path.join(__dirname, 'data.json')

function getDate(daysFromNow) {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString().slice(0, 10)
}

function getDefaultData() {
  return {
    products: [
      { id: 1, name: 'Manzanas', stock: 50, expiration_date: getDate(14) },
      { id: 2, name: 'Plátanos', stock: 30, expiration_date: getDate(5) },
      { id: 3, name: 'Naranjas', stock: 45, expiration_date: getDate(21) },
      { id: 4, name: 'Uvas', stock: 25, expiration_date: getDate(3) },
      { id: 5, name: 'Fresas', stock: 20, expiration_date: getDate(2) },
      { id: 6, name: 'Melón', stock: 15, expiration_date: getDate(7) },
      { id: 7, name: 'Sandía', stock: 12, expiration_date: getDate(10) },
      { id: 8, name: 'Piña', stock: 18, expiration_date: getDate(14) },
      { id: 9, name: 'Mango', stock: 22, expiration_date: getDate(6) },
      { id: 10, name: 'Pera', stock: 35, expiration_date: getDate(12) },
      { id: 11, name: 'Kiwi', stock: 28, expiration_date: getDate(9) },
      { id: 12, name: 'Limón', stock: 40, expiration_date: getDate(15) },
      { id: 13, name: 'Mandarina', stock: 38, expiration_date: getDate(18) },
      { id: 14, name: 'Papaya', stock: 10, expiration_date: getDate(4) },
      { id: 15, name: 'Melocotón', stock: 16, expiration_date: getDate(8) },
      { id: 16, name: 'Cerezas', stock: 14, expiration_date: getDate(-1) },
      { id: 17, name: 'Aguacate', stock: 20, expiration_date: getDate(1) }
    ],
    entries: [],
    exits: [],
    nextProductId: 18,
    nextEntryId: 1,
    nextExitId: 1
  }
}

function read() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    if (err.code === 'ENOENT') {
      const data = getDefaultData()
      write(data)
      return data
    }
    throw err
  }
}

function write(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export const jsonStore = {
  read,
  write,
  getDefaultData
}
