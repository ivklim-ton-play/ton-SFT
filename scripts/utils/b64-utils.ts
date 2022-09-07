export function decode64bin(str: string) {
  return Buffer.from(str, "base64").toString("binary");
}
export function encode64bin(str: string) {
  return Buffer.from(str, "binary").toString("base64");
}

export function decode64hex(str: string) {
  return Buffer.from(str, "base64").toString("hex");
}
export function encode64hex(str: string) {
  return Buffer.from(str, "hex").toString("base64");
}
