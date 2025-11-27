// APIs
export const API_AUTH = "https://reqres.in/api/users";
export const API_POSTS = "https://jsonplaceholder.typicode.com";
export const API_BOOKS = "https://openlibrary.org";
export const BOOKS_COVER = "https://covers.openlibrary.org/b/id";

// Roles
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

// Rutas
export const ROUTES = {
  PUBLICS: ["/login"],
  ADMIN: ["/users", "/posts/create", "/posts/new", "/posts/edit"],
};
