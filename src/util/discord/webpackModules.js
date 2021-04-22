const obj = { // https://github.com/rauenzi/BetterDiscordApp/blob/master/src/modules/webpackModules.js
  req: undefined,

  init: () => {
    obj.req = window.webpackJsonp.push([[], {__extra_id__: (module, exports, req) => module.exports = req}, [["__extra_id__"]]]);

    delete obj.req.m.__extra_id__;
    delete obj.req.c.__extra_id__;

    obj.generateCommons();
  },
  
  find: (filter) => {
    for (const i in obj.req.c) {
      if (obj.req.c.hasOwnProperty(i)) {
          const m = obj.req.c[i].exports;
          if (m && m.__esModule && m.default && filter(m.default)) return m.default;
          if (m && filter(m))	return m;
      }
    }

    // console.warn("Cannot find loaded module in cache");
    return null;
  },

  findAll: (filter) => {
    const modules = [];
    for (const i in obj.req.c) {
        if (obj.req.c.hasOwnProperty(i)) {
            const m = obj.req.c[i].exports;
            if (m && m.__esModule && m.default && filter(m.default)) modules.push(m.default);
            else if (m && filter(m)) modules.push(m);
        }
    }
    return modules;
  },

  findByProps: (...propNames) => obj.find(module => propNames.every(prop => module[prop] !== undefined)),
  findByPropsAll: (...propNames) => obj.findAll(module => propNames.every(prop => module[prop] !== undefined)),

  findByPrototypes: (...protoNames) => obj.find(module => module.prototype && protoNames.every(protoProp => module.prototype[protoProp] !== undefined)),

  findByDisplayName: (displayName) => obj.find(module => module.displayName === displayName),

  generateCommons: () => {
    obj.common.React = obj.findByProps('createElement');
    obj.common.ReactDOM = obj.findByProps('render', 'hydrate');

    obj.common.Flux = obj.findByProps('Store', 'CachedStore', 'PersistedStore');
    obj.common.FluxDispatcher = obj.findByProps('_waitQueue', '_orderedActionHandlers');
    
    obj.common.i18n = obj.findByProps('Messages', '_requestedLocale');
  },

  common: {}
};

obj.init();

export default obj;
