# Frutería Dashboard

Dashboard web para la gestión de productos de una frutería: control de inventario, entradas, salidas y caducidad. Incluye usabilidad y accesibilidad.

**Base de datos:** JSON falsa (archivo `data.json`) — no requiere PostgreSQL ni instalación adicional.

## Requisitos

- **Node.js** 16 o superior

## Instalación

### 1. Clonar o descargar el proyecto

```bash
git clone <url-del-repositorio>
cd fruteria-dashboard
```

### 2. Instalar dependencias

```bash
cd backend
npm install
```

## Comando para correr el proyecto

El backend sirve tanto la API como el frontend. Un solo comando inicia todo:

```bash
cd backend
npm start
```

- **API:** http://localhost:3000/api/...
- **Frontend:** http://localhost:3000 — abrir esta URL en el navegador para usar el dashboard

La primera vez que se ejecute, se creará automáticamente el archivo `data.json` con 17 productos de ejemplo.

## Estructura del proyecto

```
fruteria-dashboard/
├── backend/           # API Node.js + Express
│   ├── src/
│   │   ├── api/       # Servidor y rutas
│   │   └── infrastructure/
│   │       ├── database/  # jsonStore.js, data.json (generado)
│   │       └── repositories/
│   └── package.json
├── frontend/          # Interfaz web (HTML, CSS, JS)
│   ├── index.html
│   ├── app.js
│   └── styles.css
└── README.md
```

## Funcionalidades

- **Dashboard**: Stock total, productos por caducar, caducados, entradas y salidas recientes
- **Productos**: Listado (mín. 15), alta, edición y eliminación (CRUD)
- **Entradas**: Registro de entradas con actualización automática del stock
- **Salidas**: Registro con validación para evitar stock negativo
- **Caducidad**: Productos vigentes, por caducar y caducados con indicadores visuales

## Accesibilidad

- Etiquetas y validaciones correctas en formularios
- Buen contraste de colores (WCAG AA)
- Navegación por teclado y scroll
- Mensajes claros de éxito, error y advertencia
- Enlace "Ir al contenido principal" para lectores de pantalla

## Entrega (Google Classroom)

1. Subir el código a GitHub
2. Crear un documento (bloc de notas o Word) con el enlace del repositorio
3. El proyecto debe ejecutarse correctamente siguiendo este README
