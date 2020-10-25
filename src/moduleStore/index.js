import { sha512 } from '../util/hash';

const JSCache = require('./jsCache');

let goosemodScope = {};

export default {
  setThisScope: (scope) => {
    goosemodScope = scope;
    JSCache.setThisScope(scope);
  },

  modules: [],

  apiBaseURL: 'https://goosemod-api.netlify.app',

  jsCache: JSCache,

  updateModules: async () => {
    goosemodScope.moduleStoreAPI.modules = (await goosemodScope.cspBypasser.json(`${goosemodScope.moduleStoreAPI.apiBaseURL}/modules.json`, false)).sort((a, b) => a.name.localeCompare(b.name));
  },

  importModule: async (moduleName) => {
    const moduleInfo = goosemodScope.moduleStoreAPI.modules.find((x) => x.filename === moduleName);

    const jsCode = await goosemodScope.moduleStoreAPI.jsCache.getJSForModule(moduleName);

    const calculatedHash = await sha512(jsCode);
    if (calculatedHash !== moduleInfo.hash) {
      goosemodScope.showToast(`Cancelled importing of ${moduleName} due to hash mismatch`, {timeout: 2000});

      console.warn('Hash mismatch', calculatedHash, moduleInfo.hash);
      return;
    }

    await goosemodScope.importModule({
      filename: `${moduleInfo.filename}.js`,
      data: jsCode
    });

    if (goosemodScope.modules[moduleName].onLoadingFinished !== undefined) {
      await goosemodScope.modules[moduleName].onLoadingFinished();
    }

    let settingItem = goosemodScope.settings.items.find((x) => x[1] === 'Module Store');

    let item = settingItem[2].find((x) => x.subtext === moduleInfo.description);

    item.buttonType = 'danger';
    item.buttonText = 'Remove';
    item.showToggle = true;

    if (goosemodScope.settings.isSettingsOpen() && !goosemodScope.initialImport) goosemodScope.settings.createFromItems();
  },

  moduleRemoved: async (m) => {
    let item = goosemodScope.settings.items.find((x) => x[1] === 'Module Store')[2].find((x) => x.subtext === m.description);
    
    if (item === undefined) return;

    item.buttonType = 'brand';
    item.buttonText = 'Import';
    item.showToggle = false;
  },

  updateStoreSetting: () => {
    let item = goosemodScope.settings.items.find((x) => x[1] === 'Module Store');

    item[2] = item[2].slice(0, 5);

    let sortedCategories = goosemodScope.moduleStoreAPI.modules.reduce((cats, o) => cats.includes(o.category) ? cats : cats.concat(o.category), []).sort((a, b) => a.localeCompare(b));

    let arr = Object.entries(goosemodScope.moduleStoreAPI.modules.reduce((cats, o) => {
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
          
          class: m.category,

          buttonType: goosemodScope.modules[m.filename] ? 'danger' : 'brand',
          showToggle: goosemodScope.modules[m.filename],

          text: `${m.name} <span class="description-3_Ncsb">by</span> ${m.author}`, // ` <span class="description-3_Ncsb">(v${m.version})</span>`,
          subtext: m.description,
          subtext2: `v${m.version}`,

          buttonText: goosemodScope.modules[m.filename] ? 'Remove' : 'Import',
          onclick: async (el) => {
            if (goosemodScope.modules[m.filename]) {
              el.textContent = 'Removing...';

              goosemodScope.settings.removeModuleUI(m.filename, 'Module Store');

              return;
            }

            el.textContent = 'Importing...';

            await goosemodScope.moduleStoreAPI.importModule(m.filename);

            goosemodScope.settings.createFromItems();
            goosemodScope.settings.openSettingItem('Module Store');
          },
          isToggled: () => goosemodScope.modules[m.filename] !== undefined,
          onToggle: async (checked) => {
            if (checked) {
              goosemodScope.modules[m.filename] = Object.assign({}, goosemodScope.disabledModules[m.filename]);
              delete goosemodScope.disabledModules[m.filename];

              await goosemodScope.modules[m.filename].onImport();

              await goosemodScope.modules[m.filename].onLoadingFinished();

              goosemodScope.loadSavedModuleSetting(m.filename);
            } else {
              goosemodScope.disabledModules[m.filename] = Object.assign({}, goosemodScope.modules[m.filename]);

              goosemodScope.modules[m.filename].remove();

              delete goosemodScope.modules[m.filename];

              goosemodScope.settings.createFromItems();
              goosemodScope.settings.openSettingItem('Module Store');
            }

            goosemodScope.settings.createFromItems();
            goosemodScope.settings.openSettingItem('Module Store');
          }
        });
      }
    }
  }
}