export default (buf) => { // ArrayBuffer (UTF-8) -> String
  return new TextDecoder().decode(buf);
  //return String.fromCharCode.apply(null, new Uint8Array(buf));
};