let wpRequire;

wpRequire = window.webpackJsonp.push([[], { get_require: (mod, _exports, wpRequire) => mod.exports = wpRequire }, [["get_require"]]]); // Get Webpack's require via injecting into webpackJsonp

// Remove module injected
delete wpRequire.m.get_require;
delete wpRequire.c.get_require;


export const all = () => Object.keys(wpRequire.c).map((x) => wpRequire.c[x].exports).filter((x) => x); // Get all modules

export const find = (filter) => { // Generic find utility
  for (const m of all()) {
    if (m.default && filter(m.default)) return m.default;
    if (filter(m)) return m;
  }
};

export const findAll = (filter) => { // Find but return all matches, not just first
  const out = [];

  for (const m of all()) {
    if (m.default && filter(m.default)) out.push(m.default);
    if (filter(m)) out.push(m);
  }

  return out;
};

export const findByProps = (...props) => find((m) => props.every((x) => m[x] !== undefined)); // Find by props in module
export const findByPropsAll = (...props) => findAll((m) => props.every((x) => m[x] !== undefined)); // Find by props but return all matches

export const findByPrototypes = (...protos) => find((m) => m.prototype && protos.every((x) => m.prototype[x] !== undefined)); // Like find by props but prototype

export const findByDisplayName = (name) => find((m) => m.displayName === name); // Find by displayName


export const common = { // Common modules
  React: findByProps('createElement'),
  ReactDOM: findByProps('render', 'hydrate'),
  
  Flux: findByProps('Store', 'CachedStore', 'PersistedStore'),
  FluxDispatcher: findByProps('_waitQueue', '_orderedActionHandlers'),

  i18n: findByProps('Messages', '_requestedLocale'),

  channels: findByProps('getSelectedChannelState', 'getChannelId'),
  constants: findByProps('API_HOST', 'CaptchaTypes')
};