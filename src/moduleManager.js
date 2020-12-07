import ab2str from './util/ab2str';

let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const importModule = async (f, isLocal = false) => {
  let field = f.filename.split('.').slice(0, -1).join('.'); // Get name of module via filename (taking away the file extension)

  goosemodScope.logger.debug('import', `Importing module: "${field}"`);

  let settingItem = goosemodScope.settings.items.find((x) => x[1] === 'Local Modules');

  if (goosemodScope.modules[field] !== undefined) {
    goosemodScope.logger.debug(`import.load.module.${field}`, 'Module already imported, removing then installing new version');

    await goosemodScope.modules[field].remove();

    if (isLocal) settingItem[2].splice(settingItem[2].indexOf(settingItem[2].find((x) => x.text === `${goosemodScope.modules[field].name} (${goosemodScope.modules[field].version})`)), 1);
  }

  if (typeof f.data === 'object') { // ArrayBuffer (UTF-8) -> String
    f.data = ab2str(f.data);
  }

  goosemodScope.modules[field] = eval(f.data); // Set goosemodScope.modules.<module_name> to the return value of the module (an object containing handlers)

  goosemodScope.logger.debug(`import.load.module.${field}`, `Evaled module JS`);

  // goosemodScope.bindHandlers(goosemodScope.modules[field]); // Bind all handlers to module parent / returned object from module code

  goosemodScope.logger.debug(`import.load.module.${field}`, `Binded handlers`);

  await goosemodScope.modules[field].onImport(); // Run the module's onImport handler

  goosemodScope.logger.debug(`import.load.module.${field}`, `Ran onImport()`);

  if (isLocal) {
    const toggleObj = {
      type: 'text-and-danger-button',
      text: `${goosemodScope.modules[field].name} <span class="description-3_Ncsb">by</span> ${goosemodScope.modules[field].author} <span class="description-3_Ncsb">(v${goosemodScope.modules[field].version})</span>`,
      buttonText: 'Remove',
      subtext: goosemodScope.modules[field].description,
      onclick: (el) => {
        const cachedName = goosemodScope.modules[field].name.slice();

        el.textContent = 'Removing...';
  
        goosemodScope.settings.removeModuleUI(field, 'Local Modules');

        goosemodScope.showToast(`Module (${cachedName}) removed`, { type: 'success' });
      }
    };

    settingItem[2].push(toggleObj);

    goosemodScope.showToast(`Module (${goosemodScope.modules[field].name}) imported`, { type: 'success' });
  }

  goosemodScope.logger.debug(`import.load.module.${field}`, `Added to Modules setting page`);
};

export const importModules = async (files, isLocal) => {
  goosemodScope.logger.debug('import', 'Looping through files');

  for (let f of files) {
    goosemodScope.importModule(f, isLocal);
  }

  goosemodScope.logger.debug('import', 'Imported all files');
};

export const bindHandlers = (handlers) => {
  for (let p in handlers) {
    if (handlers.hasOwnProperty(p) && typeof handlers[p] === 'function') {
      handlers[p] = handlers[p].bind(goosemodScope);
    }
  }

  return handlers;
};

export const getModuleFiles = async () => { // Ask for module files (one by one due to Discord restraint) until no file is chosen
  goosemodScope.logger.debug('import.fileask', 'Asking for files');

  let allFiles = [];

  //while (true) {
    let files = await DiscordNative.fileManager.openFiles({
      filters: [
        {name: 'JS Files', extensions: ['js']},
        {name: 'All Files', extensions: ['*']}
      ],
      properties: ['openFile']
    }); // Ask for file (singular)

    if (files.length === 0) { // If no file, stop asking for files
      //break;
    }

    allFiles.push(files[0]); // Add file to files array
  //}

  goosemodScope.logger.debug('import.fileask', 'Finished asking for files');

  return allFiles;
};

export const importModulesFull = async () => {
  if (window.DiscordNative === undefined) {
    alert('Not supported in browser');
    return [];
  }

  let files = await goosemodScope.getModuleFiles();

  await goosemodScope.importModules(files, true);

  return files;
};