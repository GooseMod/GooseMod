let wpRequire;

/* if (window.webpackJsonp) { // Older
  wpRequire = window.webpackJsonp.push([[], { get_require: (mod, _exports, wpRequire) => mod.exports = wpRequire }, [["get_require"]]]); // Get Webpack's require via injecting into webpackJsonp

  // Remove module injected
  delete wpRequire.m.get_require;
  delete wpRequire.c.get_require;
} else if (window.webpackChunkdiscord_app) { // New (Canary @ 22nd Oct) */
window.webpackChunkdiscord_app.push([[ Math.random() ], {}, (req) => { wpRequire = req; }]);
// }


export const all = () => Object.keys(wpRequire.c).map((x) => wpRequire.c[x].exports).filter((x) => x); // Get all modules

const wrapFilter = (filter) => (mod) => {
  try {
    return filter(mod);
  } catch {
    return false;
  }
};

export const find = (_filter, tryDefault = true) => { // Generic find utility
  const filter = wrapFilter(_filter);

  for (const m of all()) {
    if (tryDefault && m.default && filter(m.default)) return m.default;
    if (filter(m)) return m;
  }
};

export const findAll = (_filter, tryDefault = true) => { // Find but return all matches, not just first
  const filter = wrapFilter(_filter);
  const out = [];

  for (const m of all()) {
    if (tryDefault && m.default && filter(m.default)) out.push(m.default);
    if (filter(m)) out.push(m);
  }

  return out;
};

export const findByProps = (...props) => find((m) => props.every((x) => m[x] !== undefined)); // Find by props in module
export const findByPropsAll = (...props) => findAll((m) => props.every((x) => m[x] !== undefined)); // Find by props but return all matches

export const findByPrototypes = (...protos) => find((m) => m.prototype && protos.every((x) => m.prototype[x] !== undefined)); // Like find by props but prototype

export const findByDisplayName = (name) => {
  const ret = find((m) => m.displayName === name); // Find by displayName

  // Jank fixes for old names / etc, temporarily
  if (!ret && name === 'Text') return find((m) => m.displayName === 'LegacyText'); // Text -> LegacyText
  if (name === 'Header') return find((m) => m.displayName === 'LegacyHeader'); // Header -> LegacyHeader

  return ret;
};

export const findByDisplayNameAll = (name) => findAll((m) => m.displayName === name); // Find *all* by displayName

export const findByModuleId = (id) => wpRequire.c[id];


export const common = { // Common modules
  React: findByProps('createElement'),
  ReactDOM: findByProps('render', 'hydrate'),

  Flux: findByProps('Store', 'connectStores'),
  FluxDispatcher: findByProps('register', 'wait'),

  i18n: findByProps('Messages', '_requestedLocale'),

  channels: findByProps('getChannelId', 'getVoiceChannelId'),
  constants: findByProps('API_HOST')
};
