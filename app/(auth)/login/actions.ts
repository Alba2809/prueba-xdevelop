"use server";

import { cookies } from "next/headers";
import { LoginPayload, loginRequest } from "@/services/auth.service";
import { validateSchema } from "@/utils/validateSchema";
import { loginSchema } from "./schema";
import { refreshTokenTime } from "@/utils/cookies";
import { useAuthStore } from "@/stores/auth.store";
import { deriveUserIdFromToken } from "@/utils/user";

export async function loginAction(data: LoginPayload) {
  try {
    // validar datos con zod
    const parsed = validateSchema(loginSchema, data);

    if (!parsed.ok) throw new Error("Datos incorrectos");

    const result = await loginRequest(data);

    if (!result.ok || !result.token) {
      throw new Error(result.message, {
        cause: 400,
      });
    }

    // se asigna el rol aleatorio
    const role = data.email.startsWith("admin") ? "admin" : "user";

    // se crean las cookies
    await createCookies(result.token, role);

    return {
      ok: true,
      role,
      error: null,
    };
  } catch (error: any) {
    return {
      ok: false,
      error: error.message || "Error inesperado",
    };
  }
}

export async function createCookies(token: string, role: "admin" | "user") {
  const cookieStore = await cookies();
  // varias de las cookies se guardan de forma directa y plana

  // guardar accessToken
  cookieStore.set("accessToken", token, {
    httpOnly: false,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  // guardar refresh token simulado
  const expiresAt = String(Date.now() + refreshTokenTime);
  cookieStore.set("refreshToken", expiresAt, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
  });

  // simulación del role según correo
  // emails que empiezan por admin son admin

  cookieStore.set("role", role, {
    httpOnly: false,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  // userId simulado
  const userId = deriveUserIdFromToken(token);

  cookieStore.set("userId", String(userId), {
    httpOnly: false,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  // guardar datos en zustand
  useAuthStore.getState().setAccessToken(token);
  useAuthStore.getState().setUserId(userId);
  useAuthStore.getState().setRole(role);
}
