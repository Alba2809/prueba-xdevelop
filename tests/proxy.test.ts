/// tests/proxy.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { NextURL } from "next/dist/server/web/next-url";
import { NextResponse } from "next/server";
import { proxy } from "../proxy";

function createRequest(path: string, cookies: Record<string, string> = {}) {
  const url = new URL(`http://localhost:3000${path}`);
  const req = {
    nextUrl: {
        pathname: path,
    },
    url: `http://localhost:3000${path}`,
    cookies: {
      get: (key: string) =>
        cookies[key] ? { name: key, value: cookies[key] } : undefined,
    },
  } as unknown as NextRequest;

  return req;
}

// test para el refresh
beforeEach(() => {
  vi.restoreAllMocks();
});

describe("Proxy / Middleware tests", () => {
  // 1. SIN TOKEN
  it("redirige a /login si no hay token y ruta es privada", async () => {
    const req = createRequest("/posts");

    const res = await proxy(req);
    
    expect(res?.status).toBe(307);
    expect(res?.headers.get("location")!.endsWith("/login")).toBe(true);
  });

  // 2. CON TOKEN
  it("redirige a /posts si ya tiene token e intenta ir a /login", async () => {
    const req = createRequest("/login", {
      accessToken: "ABC123",
      role: "user",
    });

    const res = await proxy(req);

    expect(res?.status).toBe(307);
    expect(res?.headers.get("location")!.endsWith("/posts")).toBe(true);
  });

  // 3. RUTA ADMIN
  it("redirige si no es admin y entra a ruta admin", async () => {
    const req = createRequest("/users", {
      accessToken: "ABC123",
      role: "user",
    });

    const res = await proxy(req);

    expect(res?.status).toBe(307);
    expect(res?.headers.get("location")!.endsWith("/posts")).toBe(true);
  });

  // 4. TOKEN EXPIRADO
  it("intenta refresh cuando token está expirado", async () => {
    const now = Date.now();

    // mockear fetch: refresh EXITOSO
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        accessToken: "NEW_TOKEN",
      }),
    } as any);

    const req = createRequest("/posts", {
      accessToken: "ABC123",
      expiresAt: String(now - 1000), // exp expired
      role: "user",
    });

    const res = await proxy(req);

    expect(fetch).toHaveBeenCalledOnce();
    expect(res?.cookies.get("accessToken")?.value).toBe("NEW_TOKEN");
    expect(res?.status).toBe(200); // NextResponse.next()
  });

  // 5. TOKEN EXPIRADO PERO REFRESH FALLA → logout
  it("borra cookies y redirige a /login si refresh falla", async () => {
    const now = Date.now();

    // mockear refresh fallido
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as any);

    const req = createRequest("/posts", {
      accessToken: "OLD",
      expiresAt: String(now - 1000),
      refreshToken: "123",
      role: "user",
    });

    const res = await proxy(req);

    expect(res?.status).toBe(307);
    expect(res?.headers.get("location")!.endsWith("/login")).toBe(true);

    // cookies borradas
    // nextjs no borra cookies sino que las coloca como expiradas
    const accessToken = res.cookies.get("accessToken");
    expect(accessToken?.value).toBe("");
    expect(Number(accessToken?.expires)).toBe(0);

    const refreshToken = res.cookies.get("refreshToken");
    expect(refreshToken?.value).toBe("");
    expect(Number(refreshToken?.expires)).toBe(0);
  });
});
