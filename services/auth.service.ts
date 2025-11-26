import axios from "axios";
import { api } from "./http";

export interface LoginPayload {
  email: string;
  password: string;
}

export async function loginRequest(credentials: LoginPayload) {
  try {
    const { data } = await api.post(
      "https://reqres.in/api/login",
      credentials,
      {
        headers: {
          "x-api-key": "reqres-free-v1",
        },
      }
    );

    return { ok: true, token: data.token };
  } catch (error: any) {
    // Si ReqRes devuelve "user not found", usamos login simulado
    const message = error.response?.data?.error || "Error desconocido";

    if (message === "user not found") {
      return {
        ok: true,
        token: "SIMULATED_TOKEN_123456",
      };
    }

    return { ok: false, message, token: null };
  }
}

export async function refreshAccessToken() {
  try {
    console.log("Refrescando token")
    const res = await axios.post("/api/auth/refresh");

    if (!res.data.accessToken) {
      return {
        ok: false,
      };
    }

    return {
      ok: true,
      accessToken: res.data.accessToken,
    };
  } catch (error) {
    return {
      ok: false,
    };
  }
}
