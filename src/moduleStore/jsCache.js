export const getCache = () => JSON.parse(localStorage.getItem('goosemodJSCache') || '{}');
export const purgeCache = () => localStorage.removeItem('goosemodJSCache');

export const updateCache = (moduleName, version, js) => {
  let cache = globalThis.moduleStoreAPI.jsCache.getCache();

  cache[moduleName] = {version, js};

  localStorage.setItem('goosemodJSCache', JSON.stringify(cache));
};

export const getJSForModule = async (moduleName) => {
  const moduleInfo = globalThis.moduleStoreAPI.modules.find((x) => x.filename === moduleName);
  const cache = globalThis.moduleStoreAPI.jsCache.getCache();

  if (cache[moduleName] && moduleInfo.version === cache[moduleName].version) {
    return cache[moduleName].js;
  } else {
    const js = await globalThis.cspBypasser.text(moduleInfo.codeURL, false);

    globalThis.moduleStoreAPI.jsCache.updateCache(moduleName, moduleInfo.version, js);

    return js;
  }
};