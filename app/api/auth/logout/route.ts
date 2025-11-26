import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Eliminar cookies de autenticación
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("role");

    return NextResponse.json({ message: "Se ha cerrado la sesión." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al cerrar la sesión" },
      { status: 500 }
    );
  }
}
