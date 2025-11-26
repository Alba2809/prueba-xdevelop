export function getAccessToken() {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/accessToken=([^;]+)/);
  return match ? match[1] : null;
}

export function getRole() {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/role=([^;]+)/);
  return match ? match[1] : null;
}

export const refreshTokenTime = 1000 * 60 * 1;