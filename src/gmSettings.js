let cache;

export const get = () => {
  // Cache as this function is called frequently
  if (cache) return cache;
  
  cache = JSON.parse(localStorage.getItem('goosemodGMSettings')) || {
    changelog: true,
    separators: true,

    devchannel: false,

    autoupdate: true,

    allThemeSettings: false
  };

  if (cache.allThemeSettings === undefined) { // New setting defaults to true
    cache.allThemeSettings = false;
  }

  return cache;
};

export const set = (key, value) => {
  const settings = get();

  settings[key] = value;

  localStorage.setItem('goosemodGMSettings', JSON.stringify(settings));

  cache = undefined; // Invalidate cache
};