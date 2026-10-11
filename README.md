# ☕ Cafecito Feliz

Punto de venta de mostrador para la cafetería ficticia **Cafecito Feliz**. Lo usan cajeros y administradores: arman el pedido, lo ligan a un cliente (buscado por teléfono), se aplica el descuento de lealtad y se genera el ticket.

Un solo repo con dos proyectos independientes, cada uno con su propio `package.json`:

| Carpeta | Qué es | Stack |
| --- | --- | --- |
| [`cafecito-api/`](cafecito-api) | Backend REST | Node + Express 5 + Mongoose + JWT |
| [`cafecito-app/`](cafecito-app) | Frontend | React 19 + Vite + React Router + axios |

---

## Correr en local

Requisitos: Node 20.19 o superior y MongoDB corriendo en `127.0.0.1:27017`.

```bash
# Backend (http://localhost:4000)
cd cafecito-api
cp .env.example .env      # y llena JWT_SECRET / JWT_REFRESH_TOKEN
npm install
npm run seed              # menú, recompensas y perfiles admin/caja
npm run dev

# Frontend (http://localhost:3000)
cd cafecito-app
cp .env.example .env
npm install
npm run dev
```

Para generar un secreto JWT:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Despliegue (MongoDB Atlas + Render)

Igual que mundo-halo: **un repo de GitHub, dos servicios de Render** apuntando a distintas carpetas raíz, y la base de datos en **MongoDB Atlas**.

### 1. MongoDB Atlas

1. Crear un cluster gratis (M0).
2. **Database Access**: crear un usuario con contraseña.
3. **Network Access**: permitir `0.0.0.0/0` (Render no tiene IP fija en el plan gratis).
4. **Connect → Drivers**: copiar la URI y agregar el nombre de la base antes del `?`:
   `mongodb+srv://USUARIO:CONTRASEÑA@cluster0.xxxxx.mongodb.net/cafecito_feliz?retryWrites=true&w=majority`
5. Cargar los datos iniciales desde tu compu, apuntando a Atlas solo para ese comando (PowerShell):

   ```powershell
   cd cafecito-api
   $env:MONGODB_URI="mongodb+srv://..."
   $env:SEED_ADMIN_PASSWORD="una-contraseña-segura"
   $env:SEED_CASHIER_PASSWORD="otra-contraseña-segura"
   npm run seed
   ```

   `dotenv` no pisa variables que ya existen, así que tu `.env` local no se toca. Cierra la terminal al terminar para que esas variables se borren.

### 2. Render: API (Web Service)

| Campo | Valor |
| --- | --- |
| Root Directory | `cafecito-api` |
| Build Command | `npm install` |
| Start Command | `npm start` |

Variables de entorno: `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_TOKEN`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `CORS_ORIGIN` (la URL del Static Site, sin `/` final). **No** definir `PORT`: Render la pone sola.

### 3. Render: frontend (Static Site)

| Campo | Valor |
| --- | --- |
| Root Directory | `cafecito-app` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

Variable de entorno: `VITE_API_URL` = `https://<tu-api>.onrender.com/api`.

En **Redirects/Rewrites** agregar: Source `/*`, Destination `/index.html`, Action **Rewrite**. Sin esto, recargar la página en una ruta como `/ventas` da 404.

### Notas

- La API gratis de Render se duerme tras 15 min sin uso; la primera petición tarda ~50 s. Por eso el `timeout` de axios es de 60 s.
- Vite mete `VITE_API_URL` en el código al hacer el build: si la cambias, hay que volver a desplegar el Static Site.
