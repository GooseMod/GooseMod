let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const saveModuleSettings = async () => {
  //goosemodScope.logger.debug('settings', 'Saving module settings...');

  let settings = JSON.parse(localStorage.getItem('goosemodModules')) || {};

  for (let p in goosemodScope.modules) {
    if (goosemodScope.modules.hasOwnProperty(p)) {
      settings[p] = await (goosemodScope.modules[p].getSettings || (async () => []))();
    }
  }

  if (JSON.stringify(JSON.parse(localStorage.getItem('goosemodModules'))) !== JSON.stringify(settings)) {
    localStorage.setItem('goosemodModules', JSON.stringify(settings));

    goosemodScope.showToast('Settings saved');
  }

  //console.log(settings);
};

export const clearModuleSetting = (moduleName) => {
  let settings = JSON.parse(localStorage.getItem('goosemodModules'));

  delete settings[moduleName];

  localStorage.setItem('goosemodModules', JSON.stringify(settings));
};

export const clearSettings = () => {
  localStorage.removeItem('goosemodModules');
};

export const loadSavedModuleSetting = async (moduleName) => {
  let settings = JSON.parse(localStorage.getItem('goosemodModules'));

  await (goosemodScope.modules[moduleName].loadSettings || (async () => []))(settings[moduleName]);
};

export const loadSavedModuleSettings = async () => {
  //goosemodScope.logger.debug('settings', 'Loading module settings...');

  let settings = JSON.parse(localStorage.getItem('goosemodModules'));

  if (!settings) return;

  for (let p in goosemodScope.modules) {
    if (goosemodScope.modules.hasOwnProperty(p) && settings.hasOwnProperty(p)) {
      await (goosemodScope.modules[p].loadSettings || (async () => []))(settings[p]);
    }
  }

  return settings;
};