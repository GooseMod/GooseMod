import ab2str from './util/ab2str';

let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const importModule = async (f, disabled = false) => {
  let field = f.name;

  goosemodScope.logger.debug('import', `Importing module: "${field}"`);

  if (goosemodScope.modules[field]?.goosemodHandlers !== undefined) {
    goosemodScope.logger.debug(`import.load.module.${field}`, 'Module already imported, removing then installing new version');

    await goosemodScope.modules[field].goosemodHandlers.onRemove();
  }

  if (typeof f.data === 'object') { // ArrayBuffer (UTF-8) -> String
    f.data = ab2str(f.data);
  }

  const modulesKey = !disabled ? 'modules' : 'disabledModules';

  goosemodScope[modulesKey][field] = Object.assign(eval(f.data), f.metadata); // Set goosemodScope.modules.<module_name> to the return value of the module (an object containing handlers)

  if (disabled) return;


  await goosemodScope.modules[field].goosemodHandlers.onImport(); // Run the module's onImport handler
};