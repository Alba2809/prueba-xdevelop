// simular el id del usuario
export function deriveUserIdFromToken(token: string) {
  const num = Number(token.replace(/\D/g, "")); // eliminar no-numéricos
  return (num % 10) + 1; // JSONPlaceholder users = 1..10
}