const hash = async (str, algorithm) => {
  const buf = await crypto.subtle.digest(algorithm, new TextEncoder('utf-8').encode(str));
  return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
};

export const sha256 = (str) => hash(str, 'SHA-256');
export const sha512 = (str) => hash(str, 'SHA-512');