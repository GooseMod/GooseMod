export default (buf) => { // ArrayBuffer (UTF-8) -> String
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};