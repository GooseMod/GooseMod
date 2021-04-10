let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};


export const disableModule = (name) => {
  let settings = JSON.parse(localStorage.getItem('goosemodDisabled')) || {};

  settings[name] = true;

  localStorage.setItem('goosemodDisabled', JSON.stringify(settings));
};

export const enableModule = (name) => {
  let settings = JSON.parse(localStorage.getItem('goosemodDisabled')) || {};

  delete settings[name];

  localStorage.setItem('goosemodDisabled', JSON.stringify(settings));
};

export const checkDisabled = (name) => {
  return Object.keys(JSON.parse(localStorage.getItem('goosemodDisabled')) || {}).includes(name);
};


export const saveModuleSettings = async () => {
  //goosemodScope.logger.debug('settings', 'Saving module settings...');

  let settings = JSON.parse(localStorage.getItem('goosemodModules')) || {};

  for (let p in goosemodScope.modules) {
    if (goosemodScope.modules.hasOwnProperty(p)) {
      settings[p] = await (goosemodScope.modules[p].goosemodHandlers.getSettings || (async () => []))();
    }
  }

  if (JSON.stringify(JSON.parse(localStorage.getItem('goosemodModules'))) !== JSON.stringify(settings)) {
    localStorage.setItem('goosemodModules', JSON.stringify(settings));

    goosemodScope.showToast('Settings saved');
  }
};

export const clearModuleSetting = (moduleName) => {
  let settings = JSON.parse(localStorage.getItem('goosemodModules'));

  if (!settings || !settings[moduleName]) return;

  delete settings[moduleName];

  localStorage.setItem('goosemodModules', JSON.stringify(settings));
};

export const clearSettings = () => {
  localStorage.removeItem('goosemodModules');
};

export const loadSavedModuleSetting = async (moduleName) => {
  let settings = JSON.parse(localStorage.getItem('goosemodModules'));

  if (!settings || !settings[moduleName]) return;

  await (goosemodScope.modules[moduleName].goosemodHandlers.loadSettings || (async () => []))(settings[moduleName]);
};

/* export const loadSavedModuleSettings = async () => {
  //goosemodScope.logger.debug('settings', 'Loading module settings...');

  let settings = JSON.parse(localStorage.getItem('goosemodModules'));

  if (!settings) return;

  for (let p in goosemodScope.modules) {
    if (goosemodScope.modules.hasOwnProperty(p) && settings.hasOwnProperty(p)) {
      await (goosemodScope.modules[p].goosemodHandlers.loadSettings || (async () => []))(settings[p]);
    }
  }

  return settings;
}; */