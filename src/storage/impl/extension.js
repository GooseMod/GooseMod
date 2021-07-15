let storageCache = {};

export const type = 'Extension';

document.addEventListener('gmes_get_ret', (data) => {
  storageCache = data;
}, { once: true });

document.dispatchEvent(new CustomEvent('gmes_get'));

export const set = (key, value) => {
  storageCache[key] = value;
  document.dispatchEvent(new CustomEvent('gmes_set', { key, value }));
};

export const get = (key) => storageCache[key] || null;

export const remove = (key) => {
  delete storageCache[key];
  document.dispatchEvent(new CustomEvent('gmes_remove', { key }));
};

export const keys = () => Object.keys(storageCache);