let cache;

const defaultSettings = {
  changelog: true,
  separators: true,
  gmBadges: true,

  devchannel: false,

  autoupdate: true,

  allThemeSettings: false
};

export const get = () => {
  // Cache as this function is called frequently
  if (cache) return cache;
  
  cache = JSON.parse(localStorage.getItem('goosemodGMSettings')) || defaultSettings;

  cache = {
    ...defaultSettings,
    ...cache
  };

  return cache;
};

export const set = (key, value) => {
  const settings = get();

  settings[key] = value;

  localStorage.setItem('goosemodGMSettings', JSON.stringify(settings));

  cache = undefined; // Invalidate cache
};