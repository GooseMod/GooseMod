import fixLocalStorage from '../../util/discord/fixLocalStorage';

export const init = () => {
  fixLocalStorage();
};
export const type = 'LocalStorage';

export const set = (key, value) => localStorage.setItem(key, value);

export const get = (key) => localStorage.getItem(key);

export const remove = (key) => localStorage.removeItem(key);

export const keys = () => Object.keys(localStorage);