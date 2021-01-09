export function verify(name) {
  return /^N\d{6}(G|V|R)\d{5}\.(png|jpg|jpeg|gif)$/.test(name);
}