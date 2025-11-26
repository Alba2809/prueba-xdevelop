import axios from "axios";
import { getAccessToken } from "@/utils/cookies";
import { refreshAccessToken } from "./auth.service";

export const api = axios.create();

/*
 * Interceptores
 * Sus objetivo es interceptar las peticiones que se hacen a las APIs y averificar, agregar, modificar la petición para su uso
 * IMPORTANTE: Esto se hizo de forma de mostrar como se deberia hacer, pero realmente no importa mucho ya que las APIs que se utilizan no cuantan con esta funcionalidad
 */

// Request interceptor
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Cola de peticiones mientras se refresca el token
let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });

  failedQueue = [];
}

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("Response interceptor");

    // Detectar si es 401 y no se ha reintentado, evitando loops infinitos de solicitudes
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Si YA se está refrescando, se agrega la solicitud a la cola
      if (isRefreshing) {
        console.log("Esta refrescando, la peticion queda pendiente");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return api(originalRequest);
        });
      }

      console.log("Se hace el refresh");
      // Se hace el refresh de token solo 1 vez
      originalRequest._retry = true;
      isRefreshing = true;

      const refresh = await refreshAccessToken();

      // Si falla, se rechaza y se prepara para redirigir al login
      if (!refresh.ok) {
        console.log("Fallo el refresh, se prepara para redirigir a login");
        processQueue(refresh, null);
        isRefreshing = false;

        return Promise.reject(error);
      }

      // Si refresh funciona, se procesa la cola de peticiones pendientes
      console.log("Refresh realizado, se procesa las solicitudes pendientes");
      processQueue(null, refresh.accessToken);
      isRefreshing = false;

      originalRequest.headers.Authorization = `Bearer ${refresh.accessToken}`;

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);
