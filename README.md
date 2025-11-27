# Prueba Técnica Frontend con Next.js

Este proyecto implementa la prueba técnica solicitada utilizando **Next.js (App Router)**, **React Query**, **Zustand**, **Shadcn UI**, **Zod**, y las APIs públicas **Reqres** y **JSONPlaceholder**.  
Contiene autenticación con roles, CRUD de posts, manejo de favoritos, búsqueda de libros, estado global persistente y una arquitectura limpia y mantenible.

---

## Tabla de Contenidos

1. [Tecnologías utilizadas](#tecnologias-utilizadas)
2. [Ejecución del proyecto](#ejecucion-del-proyecto)
3. [Arquitectura](#arquitectura)
4. [Autenticación y manejo de tokens](#autenticacion-y-manejo-de-tokens)
5. [Roles y permisos](#roles-y-permisos)
6. [Posts](#posts)
7. [Books (libros)](#books)           <!-- apunta al ancla explícita abajo -->
8. [Manejo de posts locales y API externa](#manejo-de-posts-locales-y-api-externa)
9. [Favoritos](#favoritos)
10. [Usuarios y posts por usuario](#usuarios-y-posts-por-usuario)
11. [Guía / Manual de uso](#guia--manual-de-uso)
12. [Middleware / Proxy de seguridad](#middleware--proxy-de-seguridad)
13. [Decisiones técnicas importantes](#decisiones-tecnicas-importantes)
---

<a id="tecnologias-utilizadas"></a>

## Tecnologías utilizadas

- Next.js (App Router)
- TypeScript
- React Query (@tanstack/react-query)
- Zustand
- Shadcn/UI (componentes)
- Zod (validación)
- React Hook Form
- JSONPlaceholder (posts y comentarios)
- Reqres (login / usuarios)
- OpenLibrary (búsqueda de libros y portadas)
- pnpm

---

<a id="ejecucion-del-proyecto"></a>

## Ejecución del proyecto

1. Instalar dependencias:
```bash
pnpm install
```

2. Ejecutar en desarrollo:
```bash
pnpm run dev
```

El proyecto corre en:
`http://localhost:3000`

---

<a id="arquitectura"></a>

## Arquitectura del proyecto (simplificada)

```
src/
 ├─ app/
 │   ├─ login/
 │   ├─ posts/
 │   │   ├─ [id]/
 │   │   ├─ new/
 │   │   └─ user/
 │   │   └─ hooks/
 │   ├─ users/
 │   │   ├─ [id]/
 │   ├─ books/
 │   │   ├─ [id]/
 │   │   └─ search/
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

<a id="autenticacion-y-manejo-de-tokens"></a>

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

<a id="roles-y-permisos"></a>

## Roles y permisos

El sistema maneja dos roles:

| Rol   | Permisos                                                    |
| ----- | ----------------------------------------------------------- |
| admin | crear y editar posts, ver usuarios, ver posts de un usuario |
| user  | ver posts, ver comentarios, favoritos                       |

El proxy evita el acceso a rutas protegidas según el rol. 
Debido a que la API Reqres no ofrece sistema de autenticación real, se decidió que cualquier correo electrónico (válido) que empiece por `admin` podría acceder a todas las rutas protegidas.

---

<a id="posts"></a>

## Posts

Características implementadas:

* Listado general de posts (`/posts`)
* Ver detalles de un post (`/posts/[id]`)
* Ver comentarios
* Crear post (`/posts/new`)
* Editar post (`/posts/[id]/edit`)
* Posts por usuario (`/posts/users/[id]`)
* Favoritos
* Integración API + datos locales

### React Query

Usado para:

* caching
* sincronización
* revalidación
* actualizaciones optimistas (PUT)

---

<a id="books"></a>

## Books (libros)

Se integra la API de OpenLibrary para búsqueda y visualización de libros.

Características:

* Búsqueda de libros por título, autor y año.
* Visualización de detalles del libro
* Portadas de libros

Rutas:

* `/books` → búsqueda de libros
* `/books/[id]` → detalles del libro

Nota: A pesar de que la ruta `/books/[id]` existe, solo se utiliza la ruta `/books` para la búsqueda de libros, y se muestran los detales de un libro atraves de un `Sheet Modal`. Esto es para ver los detalles de un libro sin necesidad de navegar por la ruta principal. Aún así, la ruta es accesible si se escribe directamente la URL, por ejemplo: `/books/OL12321713W`. La cual mostrará la información del libro de forma plana.

---

<a id="manejo-de-posts-locales-y-api-externa"></a>

## Manejo de posts locales y API externa

El proyecto integra dos fuentes de datos:

| Fuente          | Comportamiento                     |
| --------------- | ---------------------------------- |
| JSONPlaceholder | posts externos “reales”            |
| Zustand         | posts creados por el usuario admin |

JSONPlaceholder no guarda cambios, por lo que los posts creados se almacenan en Zustand.

### Reglas:

1. `/posts` → mezcla posts locales + API
2. `/posts/user/[id]` → mezcla locales + API según user
3. `/posts/[id]`
   * si el post está en Zustand → no se llama a la API
   * Esta ruta existe, pero no se usa de forma explícita, ya que se implementó el componente `PostDetailsSheet` para mostrar detalles (comentarios, etc.) de un post.
4. `/posts/[id]/edit`
   * si es local → actualizar en Zustand
   * si es externo → PUT real + optimistic update

---

<a id="favoritos"></a>

## Favoritos

Cada usuario puede marcar posts como favoritos.
Se guardan en:

```
favoritePosts: number[]
```

Los favoritos se reflejan automáticamente en la UI.

---

<a id="usuarios-y-posts-por-usuario"></a>

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

<a id="guia--manual-de-uso"></a>

## Guía / Manual de uso

1. **Registro / Login**

   - Usar credenciales válidas. Para admin, el email debe ser `admin@algo.algo` y, para usuarios, el email debe ser `user@algo.algo`. Para ambos, la contraseña debe ser de al menos 6 caracteres.

2. **Navegación**

   - Menú superior para acceder a:
     - Posts
     - Usuarios
     - Libros
     - Theme (oscuro/claro)
     - Logout

3. **Gestión de Usuarios**

   - SOLO el admin puede acceder a la ruta `/users`.
   - Para ver todos los usuarios, acceder a `/users`. Boton de `Usuarios` en la barra de navegación.
   - Para cambiar el rol de un usuario, acceder al listado de usuarios y hacer clic en el listado de acciones del usuario y seleccionar `Cambiar rol`.
   - Para cambiar el rol de multiples usuarios, acceder al listado de usuarios, hacer clic en el checkbox de selección y hacer clic en el botón `Cambiar rol` (Puede ser de cualquier listado de acciones).
   - Para eliminar un usuario, acceder al listado de usuarios y hacer clic en el listado de acciones del usuario y seleccionar `Eliminar`. (Mismo caso anterior para multiples usuarios).
   - Existen diferentes filtros para ver usuarios:
     - Por email
     - Por rol (admin/user)
   - La paginación funciona correctamente. Y, adicionalmente, se puede cambiar el orden de los resultados por `Email` y decidir que columnas se muestran.

4. **Gestión de Posts**

   - SOLO el admin puede crear y editar posts. Y, solo puede editar los propios posts. (Mismo id de usuario)
   - Para ver todos los posts, acceder a `/posts`. Boton de `Posts` en la barra de navegación.
   - Para ver los posts de un usuario, acceder al listado de usuarios y hacer clic en las acciones de un usuario y seleccionar `Ver posts`.
   - Para crear un post, acceder al listado de posts y hacer clic en el botón `Nuevo Post`.
   - Para editar un post, acceder al listado de posts y hacer clic en el botón `Editar` de un post.
   - Para marcar un post como favorito, acceder al listado de posts y hacer clic en el botón `Favoritos` (Tiene el icono de estrella). Hacer clic nuevamente para desmarcar.

5. **Búsqueda de Libros**

   - Acceder a `/books` y usar el formulario de búsqueda.
   - El sistema de búsqueda de libros cuanta con debounce, por lo que la búsqueda se realizará automáticamente después de un tiempo de espera (600ms por defecto).
   - Se puede buscar por título, autor y/o año.
   - Al hacer clic en un libro, se muestra el detalles del libro en una `Sheet Modal`.
   - Paginación: 
      - Se cuenta con un infinite scroll para cargar más libros. De tal forma que se realiza la petición de nuevos libros (en caso de haber y según la "página actual") de forma automática.

---

<a id="middleware--proxy-de-seguridad"></a>

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

<a id="decisiones-tecnicas-importantes"></a>

## Algunas decisiones técnicas importantes

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

<a id="conclusión"></a>

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
