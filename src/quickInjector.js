(async function () {
  const ab2str = (buf) => { // ArrayBuffer (UTF-8) -> String
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  };

  eval(ab2str((await DiscordNative.fileManager.openFiles())[0].data));
})();