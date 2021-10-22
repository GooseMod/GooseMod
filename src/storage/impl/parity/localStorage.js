export const backup = async ({ keys, get }) => {
  if (!window.localStorage) return;

  for (const k of keys()) localStorage.setItem(k, get(k));
};


export const restore = async ({ set }) => { // Extension migration should do this automatically, but try anyway?
  if (!window.localStorage) return;

  Object.keys(localStorage).filter((x) => x.toLowerCase().startsWith('goosemod')).forEach((x) => set(x, localStorage.getItem(x)));
};


export const clear = async () => {
  if (!window.localStorage) return;

  Object.keys(localStorage).filter((x) => x.toLowerCase().startsWith('goosemod')).forEach((y) => localStorage.removeItem(y));
};