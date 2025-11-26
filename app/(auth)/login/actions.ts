"use server";

import { cookies } from "next/headers";
import { LoginPayload, loginRequest } from "@/services/auth.service";
import { validateSchema } from "@/utils/validateSchema";
import { loginSchema } from "./schema";
import { refreshTokenTime } from "@/utils/cookies";

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

    const cookieStore = await cookies();

    // varias de las cookies se guardan de forma directa y plana

    // guardar accessToken
    cookieStore.set("accessToken", result.token, {
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
    const role = data.email.startsWith("admin") ? "admin" : "user";

    cookieStore.set("role", role, {
      httpOnly: false,
      sameSite: "lax",
      secure: false,
      path: "/",
    });

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
