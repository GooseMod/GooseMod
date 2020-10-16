const ab2str = (buf) => { // ArrayBuffer (UTF-8) -> String
  return String.fromCharCode.apply(null, new Uint8Array(buf));
};

export const importModule = async (f) => {
  let field = f.filename.split('.').slice(0, -1).join('.'); // Get name of module via filename (taking away the file extension)

  globalThis.logger.debug('import', `Importing module: "${field}"`);
    
  let settingItem = globalThis.settings.items.find((x) => x[1] === 'Manage Modules');

  if (globalThis.modules[field] !== undefined) {
    globalThis.logger.debug(`import.load.module.${field}`, 'Module already imported, removing then installing new version');

    await globalThis.modules[field].remove();

    settingItem[2].splice(settingItem[2].indexOf(settingItem[2].find((x) => x.text === `${globalThis.modules[field].name} (${globalThis.modules[field].version})`)), 1);
  }

  if (typeof f.data === 'object') { // ArrayBuffer (UTF-8) -> String
    f.data = ab2str(f.data);
  }

  globalThis.modules[field] = eval(f.data); // Set globalThis.modules.<module_name> to the return value of the module (an object containing handlers)

  globalThis.logger.debug(`import.load.module.${field}`, `Evaled module JS`);

  globalThis.bindHandlers(globalThis.modules[field]); // Bind all handlers to module parent / returned object from module code

  globalThis.logger.debug(`import.load.module.${field}`, `Binded handlers`);

  await globalThis.modules[field].onImport(); // Run the module's onImport handler

  globalThis.logger.debug(`import.load.module.${field}`, `Ran onImport()`);

  let toggleObj = {
    type: 'text-and-danger-button',
    text: `${globalThis.modules[field].name} <span class="description-3_Ncsb">by</span> ${globalThis.modules[field].author} <span class="description-3_Ncsb">(v${globalThis.modules[field].version})</span>`,
    buttonText: 'Remove',
    subtext: globalThis.modules[field].description,
    onclick: (el) => {
      el.textContent = 'Removing...';

      globalThis.removeModuleUI(field, 'Manage Modules');
    }
  };

  settingItem[2].push(toggleObj);

  globalThis.logger.debug(`import.load.module.${field}`, `Added to Modules setting page`);
};

export const importModules = async (files) => {
  globalThis.logger.debug('import', 'Looping through files');

  for (let f of files) {
    globalThis.importModule(f);
  }

  globalThis.logger.debug('import', 'Imported all files');
};

export const bindHandlers = (handlers) => {
  for (let p in handlers) {
    if (handlers.hasOwnProperty(p) && typeof handlers[p] === 'function') {
      handlers[p] = handlers[p].bind(this);
    }
  }

  return handlers;
};

export const getModuleFiles = async () => { // Ask for module files (one by one due to Discord restraint) until no file is chosen
  globalThis.logger.debug('import.fileask', 'Asking for files');

  let allFiles = [];

  while (true) {
    let files = await DiscordNative.fileManager.openFiles(); // Ask for file (singular)

    if (files.length === 0) { // If no file, stop asking for files
      break;
    }

    allFiles.push(files[0]); // Add file to files array
  }

  globalThis.logger.debug('import.fileask', 'Finished asking for files');

  return allFiles;
};

export const importModulesFull = async () => {
  if (window.DiscordNative === undefined) {
    alert('Not supported in browser');
    return [];
  }

  let files = await globalThis.getModuleFiles();

  await globalThis.importModules(files);

  return files;
};