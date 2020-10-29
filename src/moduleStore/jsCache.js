let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const getCache = () => JSON.parse(localStorage.getItem('goosemodJSCache') || '{}');
export const purgeCache = () => localStorage.removeItem('goosemodJSCache');

export const updateCache = (moduleName, version, js) => {
  let cache = goosemodScope.moduleStoreAPI.jsCache.getCache();

  cache[moduleName] = {version, js};

  localStorage.setItem('goosemodJSCache', JSON.stringify(cache));
};

export const getJSForModule = async (moduleName) => {
  const moduleInfo = goosemodScope.moduleStoreAPI.modules.find((x) => x.filename === moduleName);
  const cache = goosemodScope.moduleStoreAPI.jsCache.getCache();

  if (cache[moduleName] && moduleInfo.version === cache[moduleName].version) {
    return cache[moduleName].js;
  } else {
    const js = await goosemodScope.cspBypasser.text(`${moduleInfo.codeURL}?_=${Date.now()}`, false);

    goosemodScope.moduleStoreAPI.jsCache.updateCache(moduleName, moduleInfo.version, js);

    return js;
  }
};