import { sha512 } from '../util/hash';

export default {
  modules: [],

  apiBaseURL: 'https://goosemod-api.netlify.app',

  jsCache: require('./jsCache'),

  updateModules: async () => {
    globalThis.moduleStoreAPI.modules = (await globalThis.cspBypasser.json(`${globalThis.moduleStoreAPI.apiBaseURL}/modules.json`, false)).sort((a, b) => a.name.localeCompare(b.name));
  },

  importModule: async (moduleName) => {
    const moduleInfo = globalThis.moduleStoreAPI.modules.find((x) => x.filename === moduleName);

    const jsCode = await globalThis.moduleStoreAPI.jsCache.getJSForModule(moduleName);

    const calculatedHash = await sha512(jsCode);
    if (calculatedHash !== moduleInfo.hash) {
      globalThis.showToast(`Cancelled importing of ${moduleName} due to hash mismatch`, {timeout: 1000});

      console.warn('Hash mismatch', calculatedHash, moduleInfo.hash);
      return;
    }

    await globalThis.importModule({
      filename: `${moduleInfo.filename}.js`,
      data: jsCode
    });

    if (globalThis.modules[moduleName].onLoadingFinished !== undefined) {
      await globalThis.modules[moduleName].onLoadingFinished();
    }

    let settingItem = globalThis.settings.items.find((x) => x[1] === 'Module Store');

    let item = settingItem[2].find((x) => x.subtext === moduleInfo.description);

    item.buttonType = 'danger';
    item.buttonText = 'Remove';
    item.showToggle = true;

    if (globalThis.isSettingsOpen() && !globalThis.initialImport) globalThis.settings.createFromItems();
  },

  moduleRemoved: async (m) => {
    let item = globalThis.settings.items.find((x) => x[1] === 'Module Store')[2].find((x) => x.subtext === m.description);
    
    if (item === undefined) return;

    item.buttonType = 'brand';
    item.buttonText = 'Import';
    item.showToggle = false;
  },

  updateStoreSetting: () => {
    let item = globalThis.settings.items.find((x) => x[1] === 'Module Store');

    item[2] = item[2].slice(0, 3);

    let sortedCategories = globalThis.moduleStoreAPI.modules.reduce((cats, o) => cats.includes(o.category) ? cats : cats.concat(o.category), []).sort((a, b) => a.localeCompare(b));

    let arr = Object.entries(globalThis.moduleStoreAPI.modules.reduce((cats, o) => {
      if (!cats[o.category]) cats[o.category]=[];
      cats[o.category].push(o);
      return cats;
    },{})).sort((a, b) => a[0].localeCompare(b[0])).map(o => o[1]);

    let funIndex = sortedCategories.indexOf('fun');

    sortedCategories.push(sortedCategories.splice(funIndex, 1)[0]);
    arr.push(arr.splice(funIndex, 1)[0]);

    for (let i = 0; i < arr.length; i++) {
      /*item[2].push({
        type: 'header',
        text: sortedCategories[i].replace(/\-/g, ' ')
      });*/

      for (let m of arr[i]) {
        item[2].push({
          type: 'card',

          buttonType: globalThis.modules[m.filename] ? 'danger' : 'brand',
          showToggle: globalThis.modules[m.filename],

          text: `${m.name} <span class="description-3_Ncsb">by</span> ${m.author}`, // ` <span class="description-3_Ncsb">(v${m.version})</span>`,
          subtext: m.description,
          subtext2: `v${m.version}`,

          buttonText: globalThis.modules[m.filename] ? 'Remove' : 'Import',
          onclick: async (el) => {
            if (globalThis.modules[m.filename]) {
              el.textContent = 'Removing...';

              globalThis.removeModuleUI(m.filename, 'Module Store');

              return;
            }

            el.textContent = 'Importing...';

            await globalThis.moduleStoreAPI.importModule(m.filename);

            globalThis.settings.createFromItems();
            globalThis.openSettingItem('Module Store');
          },
          isToggled: () => globalThis.modules[m.filename] !== undefined,
          onToggle: async (checked) => {
            if (checked) {
              globalThis.modules[m.filename] = Object.assign({}, globalThis.disabledModules[m.filename]);
              delete globalThis.disabledModules[m.filename];

              await globalThis.modules[m.filename].onImport();

              await globalThis.modules[m.filename].onLoadingFinished();

              globalThis.loadSavedModuleSetting(m.filename);
            } else {
              globalThis.disabledModules[m.filename] = Object.assign({}, globalThis.modules[m.filename]);

              globalThis.modules[m.filename].remove();

              delete globalThis.modules[m.filename];

              globalThis.settings.createFromItems();
              globalThis.openSettingItem('Module Store');
            }

            globalThis.settings.createFromItems();
            globalThis.openSettingItem('Module Store');
          }
        });
      }
    }
  }
}