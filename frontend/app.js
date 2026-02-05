/**
 * Frutería Dashboard - Gestión de inventario, entradas, salidas y caducidad
 */

const API_BASE = '/api'

async function api(path, opts = {}) {
  const res = await fetch(`${API_BASE}/${path}`, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts
  })
  const data = res.status === 204 ? {} : await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
  return data
}

const el = id => document.getElementById(id)

// Toast: mensajes de éxito, error y advertencia
function showToast(message, type = 'success') {
  const toast = el('toast')
  toast.textContent = message
  toast.className = `toast toast-${type} show`
  toast.setAttribute('role', 'alert')
  setTimeout(() => {
    toast.classList.remove('show')
  }, 4000)
}

function setNavActive(id) {
  document.querySelectorAll('[role="menuitem"]').forEach(btn => {
    btn.setAttribute('aria-current', btn.id === id ? 'page' : null)
  })
}

// Dashboard
async function renderDashboard() {
  setNavActive('nav-dashboard')
  const app = el('app')
  app.setAttribute('aria-busy', 'true')
  app.innerHTML = '<p>Cargando...</p>'

  try {
    const d = await api('dashboard')
    const formatDate = str => new Date(str).toLocaleDateString('es-ES', { dateStyle: 'short' })
    const formatDateTime = str => new Date(str).toLocaleString('es-ES')

    app.setAttribute('aria-busy', 'false')
    app.innerHTML = `
      <section aria-labelledby="dashboard-title">
        <h2 id="dashboard-title" class="sr-only">Resumen del dashboard</h2>
        <div class="dashboard-grid">
          <div class="dashboard-stat">
            <p><strong>Stock total</strong></p>
            <p class="value" aria-label="Stock total: ${d.totalStock} unidades">${d.totalStock ?? 0}</p>
          </div>
        </div>
        <div class="card">
          <h3>Productos por caducar (próximos 7 días)</h3>
          <ul class="product-list" aria-label="Productos por caducar">
            ${(d.expiring || []).length ? d.expiring.map(p =>
              `<li><strong>${escapeHtml(p.name)}</strong> — ${formatDate(p.expiration_date)} (stock: ${p.stock})</li>`
            ).join('') : '<li class="muted">Ninguno</li>'}
          </ul>
        </div>
        <div class="card">
          <h3>Productos caducados</h3>
          <ul class="product-list" aria-label="Productos caducados">
            ${(d.expired || []).length ? d.expired.map(p =>
              `<li class="row-caducado"><strong>${escapeHtml(p.name)}</strong> — ${formatDate(p.expiration_date)}</li>`
            ).join('') : '<li class="muted">Ninguno</li>'}
          </ul>
        </div>
        <div class="card">
          <h3>Entradas y salidas recientes</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px">
            <div>
              <h4>Entradas</h4>
              <ul class="entry-list">
                ${(d.entries || []).length ? d.entries.map(e =>
                  `<li>+${e.quantity} ${escapeHtml(e.product_name || 'Producto ' + e.product_id)} — ${formatDateTime(e.date)}</li>`
                ).join('') : '<li class="muted">Sin entradas recientes</li>'}
              </ul>
            </div>
            <div>
              <h4>Salidas</h4>
              <ul class="entry-list">
                ${(d.exits || []).length ? d.exits.map(e =>
                  `<li>-${e.quantity} ${escapeHtml(e.product_name || 'Producto ' + e.product_id)} — ${formatDateTime(e.date)}</li>`
                ).join('') : '<li class="muted">Sin salidas recientes</li>'}
              </ul>
            </div>
          </div>
        </div>
      </section>
    `
  } catch (err) {
    app.setAttribute('aria-busy', 'false')
    app.innerHTML = `<p role="alert" class="toast-error" style="padding:12px;border-radius:8px">${escapeHtml(err.message)}</p>`
    showToast(err.message, 'error')
  }
}

// Productos - listado, alta, edición, eliminación
async function renderProducts() {
  setNavActive('nav-products')
  const app = el('app')
  app.setAttribute('aria-busy', 'true')
  app.innerHTML = '<p>Cargando...</p>'

  try {
    const products = await api('products')
    const formatDate = str => new Date(str).toLocaleDateString('es-ES', { dateStyle: 'short' })

    app.setAttribute('aria-busy', 'false')
    app.innerHTML = `
      <section class="card" aria-labelledby="products-title">
        <h2 id="products-title">Gestión de productos</h2>
        <div class="controls">
          <button id="new-product" class="btn btn-primary">Nuevo producto</button>
        </div>
        <table aria-label="Listado de productos">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Stock</th>
              <th scope="col">Caducidad</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => {
              const status = getExpirationStatus(p.expiration_date)
              return `<tr class="row-${status}">
                <td>${escapeHtml(p.name)}</td>
                <td>${p.stock}</td>
                <td>${formatDate(p.expiration_date)} <span class="badge badge-${status}">${status === 'vigente' ? 'Vigente' : status === 'por-caducar' ? 'Por caducar' : 'Caducado'}</span></td>
                <td>
                  <button class="btn btn-secondary edit-product" data-id="${p.id}" aria-label="Editar ${escapeHtml(p.name)}">Editar</button>
                  <button class="btn btn-danger del-product" data-id="${p.id}" aria-label="Eliminar ${escapeHtml(p.name)}">Eliminar</button>
                </td>
              </tr>`
            }).join('')}
          </tbody>
        </table>
        ${products.length < 15 ? `<p class="muted" role="status">Hay ${products.length} productos. Se recomienda tener al menos 15.</p>` : ''}
      </section>
    `

    el('new-product').addEventListener('click', () => showProductForm())
    app.querySelectorAll('.edit-product').forEach(btn => {
      btn.addEventListener('click', () => showProductForm(btn.dataset.id))
    })
    app.querySelectorAll('.del-product').forEach(btn => {
      btn.addEventListener('click', () => deleteProduct(btn.dataset.id))
    })
  } catch (err) {
    app.setAttribute('aria-busy', 'false')
    app.innerHTML = `<p role="alert" class="toast-error" style="padding:12px">${escapeHtml(err.message)}</p>`
    showToast(err.message, 'error')
  }
}

function getExpirationStatus(expirationDate) {
  const exp = new Date(expirationDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  exp.setHours(0, 0, 0, 0)
  const diff = (exp - today) / (1000 * 60 * 60 * 24)
  if (diff < 0) return 'caducado'
  if (diff <= 7) return 'por-caducar'
  return 'vigente'
}

async function showProductForm(productId = null) {
  const app = el('app')
  const isEdit = !!productId
  let product = null
  if (isEdit) {
    try {
      product = await api(`products/${productId}`)
    } catch (e) {
      showToast(e.message, 'error')
      renderProducts()
      return
    }
  }

  app.innerHTML = `
    <section class="card" aria-labelledby="form-title">
      <h2 id="form-title">${isEdit ? 'Editar producto' : 'Nuevo producto'}</h2>
      <form id="product-form" novalidate>
        <label for="name">Nombre del producto *</label>
        <input id="name" name="name" type="text" required value="${product ? escapeHtml(product.name) : ''}" aria-required="true" />
        <label for="stock">Stock inicial</label>
        <input id="stock" name="stock" type="number" min="0" value="${product ? product.stock : 0}" aria-describedby="stock-desc" />
        <span id="stock-desc" class="sr-only">Cantidad en inventario</span>
        <label for="exp">Fecha de caducidad *</label>
        <input id="exp" name="expirationDate" type="date" required value="${product ? product.expiration_date : ''}" aria-required="true" />
        <div class="controls">
          <button type="submit" class="btn btn-primary">${isEdit ? 'Guardar' : 'Crear'}</button>
          <button type="button" id="cancel-form" class="btn btn-secondary">Cancelar</button>
        </div>
      </form>
    </section>
  `

  el('cancel-form').addEventListener('click', () => renderProducts())
  el('product-form').addEventListener('submit', async ev => {
    ev.preventDefault()
    const name = el('name').value.trim()
    const stock = Number(el('stock').value) || 0
    const expirationDate = el('exp').value
    if (!name || !expirationDate) {
      showToast('Completa nombre y fecha de caducidad', 'warning')
      return
    }
    try {
      if (isEdit) {
        await api(`products/${productId}`, { method: 'PUT', body: JSON.stringify({ name, stock, expirationDate }) })
        showToast('Producto actualizado correctamente', 'success')
      } else {
        await api('products', { method: 'POST', body: JSON.stringify({ name, stock, expirationDate }) })
        showToast('Producto creado correctamente', 'success')
      }
      renderProducts()
    } catch (err) {
      showToast(err.message, 'error')
    }
  })
}

async function deleteProduct(id) {
  if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
  try {
    await api(`products/${id}`, { method: 'DELETE' })
    showToast('Producto eliminado', 'success')
    renderProducts()
  } catch (err) {
    showToast(err.message, 'error')
  }
}

// Entradas
async function renderEntries() {
  setNavActive('nav-entries')
  const app = el('app')
  app.setAttribute('aria-busy', 'true')
  app.innerHTML = '<p>Cargando...</p>'

  try {
    const products = await api('products')
    app.setAttribute('aria-busy', 'false')
    app.innerHTML = `
      <section class="card" aria-labelledby="entries-title">
        <h2 id="entries-title">Registrar entrada</h2>
        <p>Al registrar una entrada, el stock del producto se actualizará automáticamente.</p>
        <form id="entry-form">
          <label for="entry-product">Producto *</label>
          <select id="entry-product" required aria-required="true">
            ${products.map(p => `<option value="${p.id}">${escapeHtml(p.name)} (stock actual: ${p.stock})</option>`).join('')}
          </select>
          <label for="entry-qty">Cantidad *</label>
          <input id="entry-qty" type="number" min="1" value="1" required aria-required="true" />
          <div class="controls">
            <button type="submit" class="btn btn-primary">Registrar entrada</button>
          </div>
        </form>
      </section>
    `

    el('entry-form').addEventListener('submit', async ev => {
      ev.preventDefault()
      const productId = Number(el('entry-product').value)
      const quantity = Number(el('entry-qty').value)
      try {
        await api('entries', { method: 'POST', body: JSON.stringify({ productId, quantity }) })
        showToast('Entrada registrada. Stock actualizado.', 'success')
        renderEntries()
      } catch (err) {
        showToast(err.message, 'error')
      }
    })
  } catch (err) {
    app.setAttribute('aria-busy', 'false')
    app.innerHTML = `<p role="alert" class="toast-error" style="padding:12px">${escapeHtml(err.message)}</p>`
    showToast(err.message, 'error')
  }
}

// Salidas - con validación de stock negativo
async function renderExits() {
  setNavActive('nav-exits')
  const app = el('app')
  app.setAttribute('aria-busy', 'true')
  app.innerHTML = '<p>Cargando...</p>'

  try {
    const products = await api('products')
    app.setAttribute('aria-busy', 'false')
    app.innerHTML = `
      <section class="card" aria-labelledby="exits-title">
        <h2 id="exits-title">Registrar salida</h2>
        <p>No se permite stock negativo. La cantidad no puede superar el stock disponible.</p>
        <form id="exit-form">
          <label for="exit-product">Producto *</label>
          <select id="exit-product" required aria-required="true">
            ${products.map(p => `<option value="${p.id}" data-stock="${p.stock}">${escapeHtml(p.name)} (stock: ${p.stock})</option>`).join('')}
          </select>
          <label for="exit-qty">Cantidad *</label>
          <input id="exit-qty" type="number" min="1" value="1" required aria-required="true" aria-describedby="exit-qty-hint" />
          <span id="exit-qty-hint" class="muted">No puede superar el stock disponible</span>
          <div class="controls">
            <button type="submit" class="btn btn-primary">Registrar salida</button>
          </div>
        </form>
      </section>
    `

    const qtyInput = el('exit-qty')
    const productSelect = el('exit-product')
    const updateMax = () => {
      const opt = productSelect.options[productSelect.selectedIndex]
      const max = Number(opt?.dataset.stock || 0)
      qtyInput.max = max
      qtyInput.setAttribute('aria-valuemax', max)
      if (Number(qtyInput.value) > max) qtyInput.value = max
    }
    productSelect.addEventListener('change', updateMax)
    updateMax()

    el('exit-form').addEventListener('submit', async ev => {
      ev.preventDefault()
      const productId = Number(productSelect.value)
      const quantity = Number(qtyInput.value)
      const maxStock = Number(productSelect.options[productSelect.selectedIndex].dataset.stock || 0)
      if (quantity > maxStock) {
        showToast('La cantidad supera el stock disponible. No se permite stock negativo.', 'error')
        return
      }
      try {
        await api('exits', { method: 'POST', body: JSON.stringify({ productId, quantity }) })
        showToast('Salida registrada correctamente', 'success')
        renderExits()
      } catch (err) {
        showToast(err.message, 'error')
      }
    })
  } catch (err) {
    app.setAttribute('aria-busy', 'false')
    app.innerHTML = `<p role="alert" class="toast-error" style="padding:12px">${escapeHtml(err.message)}</p>`
    showToast(err.message, 'error')
  }
}

// Caducidad - vigentes, por caducar, caducados
async function renderCaducidad() {
  setNavActive('nav-caducidad')
  const app = el('app')
  app.setAttribute('aria-busy', 'true')
  app.innerHTML = '<p>Cargando...</p>'

  try {
    const { vigentes, porCaducar, caducados } = await api('products/expiration/status')
    const formatDate = str => new Date(str).toLocaleDateString('es-ES', { dateStyle: 'short' })

    app.setAttribute('aria-busy', 'false')
    app.innerHTML = `
      <section aria-labelledby="caducidad-title">
        <h2 id="caducidad-title">Estado de caducidad</h2>
        <div class="caducidad-grid">
          <div class="card caducidad-section">
            <h3><span class="badge badge-vigente">Vigentes</span> <span class="count">${vigentes.length}</span></h3>
            <p class="muted">Caducidad en más de 7 días</p>
            <ul class="product-list">
              ${vigentes.length ? vigentes.map(p =>
                `<li><strong>${escapeHtml(p.name)}</strong> — ${formatDate(p.expiration_date)} (stock: ${p.stock})</li>`
              ).join('') : '<li class="muted">Ninguno</li>'}
            </ul>
          </div>
          <div class="card caducidad-section">
            <h3><span class="badge badge-por-caducar">Por caducar</span> <span class="count">${porCaducar.length}</span></h3>
            <p class="muted">Caducan en los próximos 7 días</p>
            <ul class="product-list">
              ${porCaducar.length ? porCaducar.map(p =>
                `<li><strong>${escapeHtml(p.name)}</strong> — ${formatDate(p.expiration_date)} (stock: ${p.stock})</li>`
              ).join('') : '<li class="muted">Ninguno</li>'}
            </ul>
          </div>
          <div class="card caducidad-section">
            <h3><span class="badge badge-caducado">Caducados</span> <span class="count">${caducados.length}</span></h3>
            <p class="muted">Fecha de caducidad vencida</p>
            <ul class="product-list">
              ${caducados.length ? caducados.map(p =>
                `<li><strong>${escapeHtml(p.name)}</strong> — ${formatDate(p.expiration_date)} (stock: ${p.stock})</li>`
              ).join('') : '<li class="muted">Ninguno</li>'}
            </ul>
          </div>
        </div>
      </section>
    `
  } catch (err) {
    app.setAttribute('aria-busy', 'false')
    app.innerHTML = `<p role="alert" class="toast-error" style="padding:12px">${escapeHtml(err.message)}</p>`
    showToast(err.message, 'error')
  }
}

function escapeHtml(str) {
  if (!str) return ''
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

// Navegación
function bindNav() {
  el('nav-dashboard').addEventListener('click', () => renderDashboard())
  el('nav-products').addEventListener('click', () => renderProducts())
  el('nav-entries').addEventListener('click', () => renderEntries())
  el('nav-exits').addEventListener('click', () => renderExits())
  el('nav-caducidad').addEventListener('click', () => renderCaducidad())
}

document.addEventListener('DOMContentLoaded', () => {
  bindNav()
  renderDashboard()
})
