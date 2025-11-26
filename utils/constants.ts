// APIs
export const API_AUTH = "https://reqres.in/api/users";
export const API_POSTS = "https://jsonplaceholder.typicode.com";
export const API_BOOKS = "https://api.booksapi.org/books";

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