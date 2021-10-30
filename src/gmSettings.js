const defaultSettings = {
  changelog: true,
  separators: true,
  gmBadges: true,
  attrs: false,
  home: true,

  devchannel: false,

  snippets: false,
  autoupdate: true,
  newModuleNotifications: false,

  placeholderimage: false,
  collapsiblehome: true,

  allThemeSettings: false,
  debugToasts: false
};

const loadStore = () => {
  const loaded = JSON.parse(goosemod.storage.get('goosemodGMSettings')) || {};

  return {
    ...defaultSettings,
    ...loaded,

    get: () => target // gmSettings.get compat (because of all theme settings using old)
  };
};

const target = { uninit: true };
export default new Proxy({ uninit: true }, {
  get(target, prop) {
    if (target.uninit) target = loadStore();

    return target[prop] ?? false;
  },
  
  set(target, prop, value) {
    if (target.uninit) target = loadStore();

    target[prop] = value;

    goosemod.storage.set('goosemodGMSettings', JSON.stringify(target));

    return true;
  }
});