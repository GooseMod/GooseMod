// Based on moduleStore/jsCache - make generic cache class in future as part of util?
import { sha512 } from '../util/hash';

let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const getCache = () => JSON.parse(goosemod.storage.get('goosemodi18nCache') || '{}');
export const purgeCache = () => goosemod.storage.remove('goosemodi18nCache');

export const updateCache = (lang, hash, goosemodStrings) => {
  let cache = getCache();

  cache[lang] = { hash, goosemodStrings };

  goosemod.storage.set('goosemodi18nCache', JSON.stringify(cache));
};

export const geti18nData = async (lang) => {
  const cache = getCache();

  if (cache[lang]) { // && moduleInfo.hash === cache[lang].hash) {
    return cache[lang].goosemodStrings;
  } else {
    const goosemodStrings = await goosemodScope.i18n.geti18nData(lang);
    const newHash = await sha512(JSON.stringify(goosemodStrings));

    updateCache(lang, newHash, goosemodStrings);

    return goosemodStrings;
  }
};