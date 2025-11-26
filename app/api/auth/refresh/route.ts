import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { refreshTokenTime } from "@/utils/cookies";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refreshToken")?.value;

    // si no existe refresh token → no se puede refrescar
    if (!refreshToken) {
      return NextResponse.json({ error: "no-refresh-token" }, { status: 401 });
    }

    // generar token nuevo (simulación)
    const newAccessToken = String(Date.now());

    // guardar nuevo accessToken accesible por JS
    cookieStore.set("accessToken", newAccessToken, {
      httpOnly: false,
      sameSite: "lax",
      secure: false,
      path: "/",
    });

    // actualizar expiration (5 minutos, simulación)
    cookieStore.set("refresToken", String(Date.now() + refreshTokenTime), {
      httpOnly: false,
      sameSite: "lax",
      secure: false,
      path: "/",
    });

    return NextResponse.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.log(error);
  }
}
