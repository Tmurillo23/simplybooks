export function getToken(token: string): string {
  const tokenAux = token.split(" ");
  if (tokenAux.length > 1) {
    return tokenAux[1];
  }
  return token;
}