let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const getCache = () => JSON.parse(localStorage.getItem('goosemodJSCache') || '{}');
export const purgeCache = () => localStorage.removeItem('goosemodJSCache');

export const updateCache = (moduleName, hash, js) => {
  let cache = goosemodScope.moduleStoreAPI.jsCache.getCache();

  cache[moduleName] = {hash, js};

  localStorage.setItem('goosemodJSCache', JSON.stringify(cache));
};

export const getJSForModule = async (moduleName) => {
  const moduleInfo = goosemodScope.moduleStoreAPI.modules.find((x) => x.name === moduleName);
  const cache = goosemodScope.moduleStoreAPI.jsCache.getCache();

  if (cache[moduleName] && moduleInfo.hash === cache[moduleName].hash) {
    return cache[moduleName].js;
  } else {
    const js = await (await fetch(`${goosemodScope.moduleStoreAPI.storeApiBaseURL}/module/${moduleName}.js?_=${Date.now()}`)).text();

    goosemodScope.moduleStoreAPI.jsCache.updateCache(moduleName, moduleInfo.hash, js);

    return js;
  }
};