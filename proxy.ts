import { type NextRequest, NextResponse } from "next/server";
import { ROLES, ROUTES } from "./utils/constants";
import { refreshTokenTime } from "./utils/cookies";
import axios from "axios";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value ?? null;
  const expiresAt = req.cookies.get("refreshToken")?.value ?? null;
  const role = req.cookies.get("role")?.value ?? null;

  const { pathname } = req.nextUrl;

  // RUTAS PÚBLICAS
  const isLoginRoute = pathname.startsWith("/login");
  const isPublicRoute = ROUTES.PUBLICS.some((route) =>
    pathname.startsWith(route)
  );

  // Ignorar rutas del sistema
  if (pathname.startsWith("/_next") || pathname.startsWith("/.well-known")) {
    return NextResponse.next();
  }

  // SI NO TIENE TOKEN -> solo puede acceder a rutas públicas
  if (!token && !isPublicRoute) {
    console.log(
      "Usuario sin token intenta acceder a una ruta no pública: " + pathname
    );
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // RUTAS EXCLUSIVAS PARA ADMIN
  const isAdminRoute = ROUTES.ADMIN.some((route) => pathname.startsWith(route));

  // SI NO ES ADMIN -> solo el admin puede acceder a rutas admin
  if (isAdminRoute && role?.toLocaleLowerCase() !== ROLES.ADMIN.toLowerCase()) {
    console.log("Usuario no admin intenta aceder a una ruta admin");
    return NextResponse.redirect(new URL("/posts", req.url));
  }

  // SI YA TIENE TOKEN -> evitar que entre al login
  if (token && isLoginRoute) {
    console.log("Usuario con token intenta acceder a login");
    return NextResponse.redirect(new URL("/posts", req.url));
  }

  // SI EXISTE TOKEN -> Verificar expiración
  if (token && expiresAt) {
    const now = Date.now();
    const exp = Number(expiresAt);
    console.log(now);
    console.log(exp);
    // Token expirado
    if (now > exp) {
      console.log("Token expirado", now, exp);
      try {
        // Intentar refrescar el token
        // La petición solo estpa de forma representativa
        // const refreshRes = await axios.post("/api/auth/refresh");
        const refreshRes = {
          status: 200,
          statusText: "OK",
          data: () => ({
            accessToken: "NEW_TOKEN",
          }),
        };

        if (refreshRes.statusText !== "OK") {
          console.log("No se pudo refrescar el token");
          // refresh fallido, redirigir al login
          const resp = NextResponse.redirect(new URL("/login", req.url));
          resp.cookies.delete("accessToken");
          resp.cookies.delete("refreshToken");
          resp.cookies.delete("role");

          return resp;
        }

        const data = refreshRes.data();

        // Actualizar los cookies
        const resp = NextResponse.next();
        resp.cookies.set("accessToken", data.accessToken, {
          httpOnly: false,
          sameSite: "lax",
          secure: false,
          path: "/",
        });
        const newExpiresAt = String(Date.now() + refreshTokenTime);
        resp.cookies.set("refreshToken", newExpiresAt, {
          httpOnly: true,
          sameSite: "lax",
          secure: true,
          path: "/",
        });

        console.log("Token actualizado");

        return resp;
      } catch (error) {
        console.log("Error al refrescar el token");
        const resp = NextResponse.redirect(new URL("/login", req.url));
        resp.cookies.delete("accessToken");
        resp.cookies.delete("refreshToken");
        resp.cookies.delete("role");

        return resp;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth/refresh|_next/static|_next/image|favicon.ico).*)"],
};
