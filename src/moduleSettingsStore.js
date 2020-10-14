export const saveModuleSettings = async () => {
  //globalThis.logger.debug('settings', 'Saving module settings...');

  let settings = JSON.parse(localStorage.getItem('goosemodModules')) || {};

  for (let p in globalThis.modules) {
    if (globalThis.modules.hasOwnProperty(p)) {
      settings[p] = await (globalThis.modules[p].getSettings || (async () => []))();
    }
  }

  if (JSON.stringify(JSON.parse(localStorage.getItem('goosemodModules'))) !== JSON.stringify(settings)) {
    localStorage.setItem('goosemodModules', JSON.stringify(settings));

    globalThis.showToast('Settings saved');
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

  await (globalThis.modules[moduleName].loadSettings || (async () => []))(settings[moduleName]);
};

export const loadSavedModuleSettings = async () => {
  //globalThis.logger.debug('settings', 'Loading module settings...');

  let settings = JSON.parse(localStorage.getItem('goosemodModules'));

  if (!settings) return;

  for (let p in globalThis.modules) {
    if (globalThis.modules.hasOwnProperty(p) && settings.hasOwnProperty(p)) {
      console.log(p, globalThis.modules[p].loadSettings, settings[p]);
      await (globalThis.modules[p].loadSettings || (async () => []))(settings[p]);
    }
  }

  return settings;
};