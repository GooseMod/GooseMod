import ab2str from './util/ab2str';

let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const importModule = async (f, disabled = false) => {
  let field = f.name;

  goosemodScope.logger.debug('import', `Importing module: "${field}"`);

  if (goosemodScope.modules[field] !== undefined) {
    goosemodScope.logger.debug(`import.load.module.${field}`, 'Module already imported, removing then installing new version');

    await goosemodScope.modules[field].goosemodHandlers.onRemove();
  }

  if (typeof f.data === 'object') { // ArrayBuffer (UTF-8) -> String
    f.data = ab2str(f.data);
  }

  const modulesKey = !disabled ? 'modules' : 'disabledModules';

  goosemodScope[modulesKey][field] = Object.assign(eval(f.data), f.metadata); // Set goosemodScope.modules.<module_name> to the return value of the module (an object containing handlers)

  goosemodScope.logger.debug(`import.load.module.${field}`, `Evaled module JS`);

  if (disabled) return;

  // goosemodScope.bindHandlers(goosemodScope.modules[field]); // Bind all handlers to module parent / returned object from module code

  goosemodScope.logger.debug(`import.load.module.${field}`, `Binded handlers`);

  await goosemodScope.modules[field].goosemodHandlers.onImport(); // Run the module's onImport handler

  goosemodScope.logger.debug(`import.load.module.${field}`, `Ran onImport()`);

  goosemodScope.logger.debug(`import.load.module.${field}`, `Added to Modules setting page`);
};

/* export const bindHandlers = (handlers) => {
  for (let p in handlers) {
    if (handlers.hasOwnProperty(p) && typeof handlers[p] === 'function') {
      handlers[p] = handlers[p].bind(goosemodScope);
    }
  }

  return handlers;
}; */