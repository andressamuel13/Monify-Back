# Endpoints Backend Desplegado

Base URL del backend desplegado:

`https://monify-back.vercel.app/api`

Endpoint de verificacion:

- `GET https://monify-back.vercel.app/api/health`

Respuesta esperada:

```json
{
  "ok": true,
  "message": "API funcionando"
}
```

## Endpoints usados por el frontend

### Auth

- `POST https://monify-back.vercel.app/api/auth/login`
- `POST https://monify-back.vercel.app/api/auth/register`
- `GET https://monify-back.vercel.app/api/auth/me`

### Categorias

- `GET https://monify-back.vercel.app/api/categorias`

### Movimientos

- `GET https://monify-back.vercel.app/api/movimientos/usuario/:userId`
- `POST https://monify-back.vercel.app/api/movimientos`
- `PUT https://monify-back.vercel.app/api/movimientos/:id`
- `DELETE https://monify-back.vercel.app/api/movimientos/:id`

### Objetivos de ahorro

- `GET https://monify-back.vercel.app/api/objetivos-ahorro/usuario/:userId`
- `GET https://monify-back.vercel.app/api/objetivos-ahorro/usuario/:userId/resumen`
- `POST https://monify-back.vercel.app/api/objetivos-ahorro`
- `PUT https://monify-back.vercel.app/api/objetivos-ahorro/:id`

### Planes libertad

- `GET https://monify-back.vercel.app/api/planes-libertad/usuario/:userId`
- `GET https://monify-back.vercel.app/api/planes-libertad/usuario/:userId/resumen`
- `POST https://monify-back.vercel.app/api/planes-libertad`
- `PUT https://monify-back.vercel.app/api/planes-libertad/:id`

## Endpoints disponibles en el backend

### Auth

- `POST https://monify-back.vercel.app/api/auth/register`
- `POST https://monify-back.vercel.app/api/auth/login`
- `POST https://monify-back.vercel.app/api/auth/google`
- `GET https://monify-back.vercel.app/api/auth/me`
- `POST https://monify-back.vercel.app/api/auth/logout`

### Usuarios

- `GET https://monify-back.vercel.app/api/usuarios`
- `GET https://monify-back.vercel.app/api/usuarios/:id`
- `POST https://monify-back.vercel.app/api/usuarios`
- `PUT https://monify-back.vercel.app/api/usuarios/:id`
- `DELETE https://monify-back.vercel.app/api/usuarios/:id`

### Categorias

- `GET https://monify-back.vercel.app/api/categorias`
- `GET https://monify-back.vercel.app/api/categorias/tipo/:tipo`
- `GET https://monify-back.vercel.app/api/categorias/:id`

### Movimientos

- `GET https://monify-back.vercel.app/api/movimientos`
- `GET https://monify-back.vercel.app/api/movimientos/usuario/:usuarioId`
- `GET https://monify-back.vercel.app/api/movimientos/usuario/:usuarioId/recientes`
- `GET https://monify-back.vercel.app/api/movimientos/usuario/:usuarioId/resumen`
- `GET https://monify-back.vercel.app/api/movimientos/usuario/:usuarioId/historial`
- `GET https://monify-back.vercel.app/api/movimientos/:id`
- `POST https://monify-back.vercel.app/api/movimientos`
- `PUT https://monify-back.vercel.app/api/movimientos/:id`
- `DELETE https://monify-back.vercel.app/api/movimientos/:id`

### Objetivos de ahorro

- `GET https://monify-back.vercel.app/api/objetivos-ahorro`
- `GET https://monify-back.vercel.app/api/objetivos-ahorro/usuario/:usuarioId`
- `GET https://monify-back.vercel.app/api/objetivos-ahorro/usuario/:usuarioId/resumen`
- `GET https://monify-back.vercel.app/api/objetivos-ahorro/:id`
- `POST https://monify-back.vercel.app/api/objetivos-ahorro`
- `PUT https://monify-back.vercel.app/api/objetivos-ahorro/:id`
- `DELETE https://monify-back.vercel.app/api/objetivos-ahorro/:id`

### Planes libertad

- `GET https://monify-back.vercel.app/api/planes-libertad`
- `GET https://monify-back.vercel.app/api/planes-libertad/usuario/:usuarioId`
- `GET https://monify-back.vercel.app/api/planes-libertad/usuario/:usuarioId/resumen`
- `GET https://monify-back.vercel.app/api/planes-libertad/:id`
- `POST https://monify-back.vercel.app/api/planes-libertad`
- `PUT https://monify-back.vercel.app/api/planes-libertad/:id`
- `DELETE https://monify-back.vercel.app/api/planes-libertad/:id`

## Variable para el frontend

```env
VITE_API_URL=https://monify-back.vercel.app/api
```
