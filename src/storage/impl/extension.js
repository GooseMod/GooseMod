import fixLocalStorage from '../../util/discord/fixLocalStorage';

let storageCache = {};

export const type = 'Extension';

export const init = () => {
  if (!window.localStorage) fixLocalStorage();

  document.addEventListener('gmes_get_return', ({ detail }) => {
    storageCache = detail;
  }, { once: true });

  document.dispatchEvent(new CustomEvent('gmes_get'));

  backup();
};

export const backup = () => {
  for (const k of keys()) localStorage.setItem(k, get(k));
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

export const keys = () => Object.keys(storageCache);