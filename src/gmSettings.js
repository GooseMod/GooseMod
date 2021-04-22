let cache;

export const get = () => {
  // Cache as this function is called frequently
  if (cache) return cache;
  
  return cache = JSON.parse(localStorage.getItem('goosemodGMSettings')) || {
    changelog: true,
    separators: true,

    devchannel: false
  };
};

export const set = (key, value) => {
  const settings = get();

  settings[key] = value;

  localStorage.setItem('goosemodGMSettings', JSON.stringify(settings));

  cache = undefined; // Invalidate cache
};