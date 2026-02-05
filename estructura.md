backend/
├── .env                    # Variables de entorno (DB credentials)
├── package.json
├── README.md
│
├── src/
│   ├── api/                # Capa API (Express)
│   │   ├── routes/
│   │   │   ├── products.routes.js
│   │   │   ├── entries.routes.js
│   │   │   └── exits.routes.js
│   │   └── server.js
│   │
│   ├── application/        # Lógica de negocio
│   │   ├── services/
│   │   │   └── InventoryService.js
│   │   └── validators/
│   │       └── stockValidator.js
│   │
│   ├── domain/             # Modelos puros
│   │   ├── entities/
│   │   │   ├── Product.js
│   │   │   ├── Entry.js
│   │   │   └── Exit.js
│   │   └── enums/
│   │       └── ExpirationStatus.js
│   │
│   └── infrastructure/     # Acceso a datos (PostgreSQL)
│       ├── database/
│       │   ├── connection.js
│       │   └── schema.sql
│       │
│       └── repositories/
│           ├── ProductRepositoryImpl.js
│           ├── EntryRepositoryImpl.js
│           └── ExitRepositoryImpl.js
