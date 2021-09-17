export const backup = async ({ keys, get }) => {
  if (!window.DiscordNative?.userDataCache) return;

  const cache = await DiscordNative.userDataCache.getCached() || {};

  for (const k of keys()) cache[k] = get(k);

  DiscordNative.userDataCache.cacheUserData(JSON.stringify(cache));
};


export const restore = async ({ set }) => {
  if (!window.DiscordNative?.userDataCache) return;

  const cache = await DiscordNative.userDataCache.getCached();

  Object.keys(cache).filter((x) => x.toLowerCase().startsWith('goosemod')).forEach((x) => set(x, cache[x]));
};
