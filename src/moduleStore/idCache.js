let goosemodScope = {};

let getUser;

export const setThisScope = (scope) => {
  goosemodScope = scope;

  getUser = goosemodScope.webpackModules.findByProps('getUser', 'fetchCurrentUser').getUser;
};

export const getCache = () => JSON.parse(localStorage.getItem('goosemodIDCache') || '{}');
export const purgeCache = () => localStorage.removeItem('goosemodIDCache');

export const updateCache = (id, data) => {
  let cache = getCache();

  cache[id] = {
    data
  };

  localStorage.setItem('goosemodIDCache', JSON.stringify(cache));
};

export const getDataForID = async (id) => {
  const cache = getCache();

  if (cache[id]) { // && cache[id].time - (1000 * 60 * 60 * 24 * 30)
    return cache[id].data;
  } else {
    const data = await getUser(id);
    updateCache(id, data);

    return data;
  }
};