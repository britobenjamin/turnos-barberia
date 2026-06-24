# SIATEMA DE GESTION - TURNOS DE BARBERIA

Aplicación web fullstack tipo CRUD para gestionar turnos de una barbería. Permite agendar, listar, editar y eliminar turnos de clientes, indicando nombre, apellido, teléfono, fecha y horario.

## TECNOLOGIAS UTILIZADAS

**BACKEND:**
- Node.js
- Express
- Prisma ORM (v7)
- MySQL
- @prisma/adapter-mariadb (driver adapter para la conexión a MySQL)

**FRONTEND:**
- HTML
- CSS
- JavaScript Vanilla (sin frameworks)

## DESCRIPCION DEL SISTEMA 

El sistema permite:

- Listar todos los turnos agendados, ordenados por fecha.
- Crear un turno nuevo desde un formulario (nombre, apellido, teléfono, fecha y horario).
- Editar los datos de un turno existente, reutilizando el mismo formulario.
- Eliminar un turno.
- Validaciones en el backend: campos obligatorios, strings vacíos, fechas inválidas, IDs inexistentes y turnos duplicados (misma fecha y horario).
- El formulario oculta automáticamente, para la fecha seleccionada, los horarios que ya están ocupados.

## ESTRUCTURA DEL PROYECYO

turnos-barberia/

├── backend/

│   ├── prisma/

│   │   ├── schema.prisma

│   │   └── migrations/

│   ├── src/

│   │   ├── index.js

│   │   ├── prismaClient.js

│   │   └── routes/

│   │       └── turnos.js

│   ├── .env (no incluido, ver instalación)

│   └── package.json

└── frontend/

├── index.html

├── style.css

└── script.js

## IBTRUCCINES DE INSTALACION

### REQUISITOS PREVIOS

- Node.js instalado
- MySQL Server instalado y corriendo
- MySQL Workbench (opcional, para administrar la base de datos visualmente)

### 1. CLONAR EL REPOSITORIO

```bash
git clone https://github.com/britobenjamin/turnos-barberia.git
cd turnos-barberia
```

### 2. INSTALAR LAS DEPENDENCIAS DEL BACKEND

```bash
cd backend
npm install
```

### 3. CONFIGURAR VARIABLES DE ENTORNO


Crear un archivo `.env` dentro de la carpeta `backend/` con el siguiente contenido, reemplazando los datos según tu configuración de MySQL:
DATABASE_URL="mysql://USUARIO:CONTRASEÑA@localhost:3306/turnos_barberia"

DB_HOST="localhost"

DB_PORT="3306"

DB_USER="USUARIO"

DB_PASSWORD="CONTRASEÑA"

DB_NAME="turnos_barberia"


### 4. CREAR LA BASE DE DATOS Y APLICAR LAS MIGRACIONES

```bash
npx prisma migrate dev
npx prisma generate
```

Esto crea la base de datos `turnos_barberia` (si no existe) y la tabla `Turno` con la estructura definida en `prisma/schema.prisma`.

## INSTRUCCIONES DE EJECUCUION

### 1. INICIAR EL BACKEND

Desde la carpeta `backend`:

```bash
node src/index.js
```

El servidor queda corriendo en `http://localhost:3000`.

### 2. INICIAR EL FRONTEND

Abrir el archivo `frontend/index.html` en el navegador (recomendado usar la extensión Live Server de VS Code para evitar problemas de carga de archivos locales).

Con el backend corriendo, la página va a listar, crear, editar y eliminar turnos correctamente.

## Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /turnos | Lista todos los turnos |
| GET | /turnos/:id | Obtiene un turno por su id |
| POST | /turnos | Crea un turno nuevo |
| PUT | /turnos/:id | Edita uno o varios campos de un turno |
| DELETE | /turnos/:id | Elimina un turno |

## AUTORES

Benjamin Brito - Lara Tomas -  Amarilla Matias  U.T.N f.r.t