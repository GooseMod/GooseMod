import fixLocalStorage from '../../util/discord/fixLocalStorage';
import paritySystems from './parity';

let storageCache = {};

export const type = 'Extension';

export const init = async () => {
  if (!window.localStorage) fixLocalStorage();

  const returnPromise = new Promise((res) => document.addEventListener('gmes_get_return', async ({ detail }) => {
    storageCache = detail;

    if (Object.keys(storageCache).length < 5) { // Empty (less than expected pairs) extension storage, try restore
      await restore();
    }

    res();
  }, { once: true }));


  document.dispatchEvent(new CustomEvent('gmes_get'));

  await returnPromise;

  await backup();
};


export const restore = async () => {
  console.log('GooseMod', 'Restoring storage...');

  for (const system of paritySystems) await system.restore({ set });
};

export const backup = async () => {
  console.log('GooseMod', 'Backing up storage...');

  for (const system of paritySystems) await system.backup({ keys, get });
};

export const set = (key, value) => {
  storageCache[key] = value;
  document.dispatchEvent(new CustomEvent('gmes_set', { detail: { key, value } }));

  backup();
};

export const get = (key) => storageCache[key] || null;

export const remove = (key) => {
  delete storageCache[key];
  document.dispatchEvent(new CustomEvent('gmes_remove', { detail: { key } }));

  backup();
};

export const clear = async () => {
  keys().filter((x) => x.toLowerCase().startsWith('goosemod')).forEach((y) => remove(y)); // Extension

  for (const system of paritySystems) await system.clear();
};

export const keys = () => Object.keys(storageCache);