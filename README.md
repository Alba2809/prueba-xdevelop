# Prueba Técnica Frontend con Next.js

Este proyecto implementa la prueba técnica solicitada utilizando **Next.js (App Router)**, **React Query**, **Zustand**, **Shadcn UI**, **Zod**, y las APIs públicas **Reqres** y **JSONPlaceholder**.
Contiene autenticación con roles, CRUD de posts, manejo de favoritos, estado global persistente y una arquitectura limpia y mantenible.

---

## Tabla de Contenidos

1. Tecnologías utilizadas
2. Ejecución del proyecto
3. Arquitectura del proyecto
4. Autenticación y manejo de tokens
5. Roles y permisos
6. Posts
7. Manejo de posts locales y API externa
8. Favoritos
9. Usuarios y posts por usuario
10. Middleware / Proxy de seguridad
11. Decisiones técnicas importantes

---

## Tecnologías utilizadas

* Next.js 14+ (App Router)
* TypeScript
* Zustand (estado global persistido)
* React Query (data fetching y caching)
* Shadcn/UI
* Zod (validación)
* React Hook Form
* JSONPlaceholder API (posts y comentarios)
* Reqres API (login y usuarios)
* pnpm

---

## Ejecución del proyecto

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Ejecutar en desarrollo

```bash
pnpm dev
```

El proyecto corre en:
`http://localhost:3000`

---

## Arquitectura del proyecto (simplificada)

```
src/
 ├─ app/
 │   ├─ login/
 │   ├─ posts/
 │   │   ├─ [id]/
 │   │   ├─ new/
 │   │   └─ hooks/
 │   ├─ users/
 │   │   ├─ [id]/
 │   │   │   └─ posts/
 │   └─ api/
 │       └─ auth/
 │           └─ refresh/
 ├─ stores/
 │   ├─ auth.store.ts
 │   └─ posts.store.ts
 ├─ services/
 │   ├─ auth.ts
 │   ├─ posts.ts
 │   └─ users.ts
 ├─ utils/
 │   ├─ cookies.ts
 │   ├─ validateSchema.ts
 │   ├─ constants.ts 
 │   └─ http.ts
```

---

## Autenticación y manejo de tokens

El login utiliza la API de Reqres:

```
POST https://reqres.in/api/login
```

Al iniciar sesión, se guardan en cookies:

* `accessToken`
* `refreshToken` (timestamp simulado)
* `role` (“admin” o “user”)
* `userId` (generado localmente)

Se utilizan las cookies de Next.js tanto en server components como en server actions.

### Refresh automático

Dado que Reqres no ofrece refresh real, se implementa un endpoint interno:

```
/api/auth/refresh
```

El proxy de Next detecta expiración de token y "llama" a este endpoint para regenerar el `accessToken`. Se puede cambiar el tiempo de refresh de `refreshTokenTime` en `cookies.ts`.

---

## Roles y permisos

El sistema maneja dos roles:

| Rol   | Permisos                                                    |
| ----- | ----------------------------------------------------------- |
| admin | crear y editar posts, ver usuarios, ver posts de un usuario |
| user  | ver posts, ver comentarios, favoritos                       |

El proxy evita el acceso a rutas protegidas según el rol. 
Debido a que la API Reqres no ofrece sistema de autenticación real, se decidió que cualquier correo electrónico (válido) que empiece por `admin` podría acceder a todas las rutas protegidas.

---

## Posts

Características implementadas:

* Listado general de posts (`/posts`)
* Ver detalles de un post (`/posts/[id]`)
* Ver comentarios
* Crear post (`/posts/new`)
* Editar post (`/posts/[id]/edit`)
* Posts por usuario (`/users/[id]/posts`)
* Favoritos
* Integración API + datos locales

### React Query

Usado para:

* caching
* sincronización
* revalidación
* actualizaciones optimistas (PUT)

---

## Manejo de posts locales y API externa

El proyecto integra dos fuentes de datos:

| Fuente          | Comportamiento                     |
| --------------- | ---------------------------------- |
| JSONPlaceholder | posts externos “reales”            |
| Zustand         | posts creados por el usuario admin |

JSONPlaceholder no guarda cambios, por lo que los posts creados se almacenan en Zustand.

### Reglas:

1. `/posts` → mezcla posts locales + API
2. `/users/[id]/posts` → mezcla locales + API según user
3. `/posts/[id]`
   * si el post está en Zustand → no se llama a la API
   * Esta ruta existe, pero no se usa de forma explícita, ya que se implementó el componente `PostDetailsSheet` para mostrar detalles (comentarios, etc.) de un post.
4. `/posts/[id]/edit`

   * si es local → actualizar en Zustand
   * si es externo → PUT real + optimistic update

---

## Favoritos

Cada usuario puede marcar posts como favoritos.
Se guardan en:

```
favoritePosts: number[]
```

Los favoritos se reflejan automáticamente en la UI.

---

## Usuarios y posts por usuario

Reqres proporciona el listado de usuarios:

```
GET https://reqres.in/api/users
```

Cada usuario tiene un botón:

```
Ver posts
```

que redirige a:

```
/users/[id]/posts
```

Dependiendo del ID:

* usuarios 1–10 tienen posts en JSONPlaceholder
* usuarios 11+ no tienen posts (comportamiento esperado)
* posts creados localmente sí aparecen si coinciden con su userId

---

## Middleware / Proxy de seguridad

En `middleware.ts` se implementa:

* Protección de rutas privadas
* Redirección cuando no hay token
* Restricciones por rol (admin/user)
* Evitar acceso a login estando autenticado
* Detección de expiración de token
* Refresh automático del token
* Eliminación de cookies si el refresh falla

Es el guard principal del sistema.

---

## Decisiones técnicas importantes

### 1. JSONPlaceholder no persiste datos

Los posts creados deben guardarse localmente.

### 2. Los IDs de Reqres no coinciden con los de JSONPlaceholder

Se maneja correctamente mostrando “sin posts” para usuarios 11+.

### 3. CRUD híbrido API + local

El sistema detecta origen del post (local o API):

* Local → editar en Zustand
* API → PUT real

### 4. Favoritos completamente locales

JSONPlaceholder no maneja usuarios reales.

### 5. React Query + Zustand funcionan juntos

React Query para datos remotos
Zustand para datos creados o propiedad del usuario

---

## Conclusión

El proyecto cumple con todos los requerimientos del PDF:

* Autenticación
* Roles
* Manejo de sesiones y refresh
* CRUD completo de posts (local + API simulada)
* Favoritos
* Posts por usuario
* Manejo de estados híbridos
* UI moderna con Shadcn
* Arquitectura profesional

Este repositorio está preparado para evaluación técnica y escalamiento a APIs r
