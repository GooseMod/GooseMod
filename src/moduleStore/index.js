import { sha512 } from '../util/hash';

const JSCache = require('./jsCache');

let goosemodScope = {};

export default {
  setThisScope: (scope) => {
    goosemodScope = scope;
    JSCache.setThisScope(scope);
  },

  modules: [],
  repos: [],

  apiBaseURL: 'https://api.goosemod.com',
  storeApiBaseURL: 'https://store.goosemod.com',

  jsCache: JSCache,

  repoURLs: undefined,

  initRepoURLs: () => {
    goosemodScope.moduleStoreAPI.repoURLs = localStorage.getItem('goosemodRepos') || [
      {
        url: `https://store.goosemod.com/goosemod.json`,
        enabled: true
      },
      {
        url: `https://store.goosemod.com/ms2porter.json`,
        enabled: true
      },
      {
        url: `https://store.goosemod.com/bdthemes.json`,
        enabled: true
      }
    ];
  },

  updateModules: async (shouldHandleLoadingText = false) => {
    goosemodScope.moduleStoreAPI.modules = [];
    goosemodScope.moduleStoreAPI.repos = [];

    let ind = 0;
    await Promise.all(goosemodScope.moduleStoreAPI.repoURLs.map(async (repo) => {
      if (!repo.enabled) return;

      if (shouldHandleLoadingText) {
        goosemodScope.updateLoadingScreen(`Getting modules...\n(${ind + 1}/${goosemodScope.moduleStoreAPI.repoURLs.length} - ${repo.url})`);
      }

      const resp = (await (await fetch(`${repo.url}?_=${Date.now()}`)).json());

      goosemodScope.moduleStoreAPI.modules = goosemodScope.moduleStoreAPI.modules.concat(resp.modules.map((x) => {
        x.repo = repo.url;
        return x;
      })).sort((a, b) => a.name.localeCompare(b.name));

      goosemodScope.moduleStoreAPI.repos.push({
        url: repo.url,

        meta: resp.meta,
        enabled: repo.enabled
      });

      ind++;
    }));

    const pureRepoUrls = goosemodScope.moduleStoreAPI.repoURLs.map((x) => x.url);

    goosemodScope.moduleStoreAPI.repos = goosemodScope.moduleStoreAPI.repos.sort((a, b) => pureRepoUrls.indexOf(a.url) - pureRepoUrls.indexOf(b.url));


    localStorage.setItem('goosemodRepos', JSON.stringify(goosemodScope.moduleStoreAPI.repoURLs));
  },

  importModule: async (moduleName) => {
    try {
      const moduleInfo = goosemodScope.moduleStoreAPI.modules.find((x) => x.name === moduleName);

      const jsCode = await goosemodScope.moduleStoreAPI.jsCache.getJSForModule(moduleName);

      const calculatedHash = await sha512(jsCode);
      if (calculatedHash !== moduleInfo.hash) {
        goosemodScope.showToast(`Cancelled importing of ${moduleName} due to hash mismatch`, {timeout: 2000, type: 'danger'});

        console.warn('Hash mismatch', calculatedHash, moduleInfo.hash);
        return;
      }

      await goosemodScope.importModule({
        name: moduleName,
        data: jsCode,
        metadata: moduleInfo
      });

      if (goosemodScope.modules[moduleName].goosemodHandlers.onLoadingFinished !== undefined) {
        await goosemodScope.modules[moduleName].goosemodHandlers.onLoadingFinished();
      }

      let settingItem = goosemodScope.settings.items.find((x) => x[1] === 'Module Store');

      let item = settingItem[2].find((x) => x.subtext === moduleInfo.description);

      item.buttonType = 'danger';
      item.buttonText = 'Remove';
      item.showToggle = true;

      // if (goosemodScope.settings.isSettingsOpen() && !goosemodScope.initialImport) goosemodScope.settings.createFromItems();
    } catch (e) {
      goosemodScope.showToast(`Failed to import module ${moduleName}`, { timeout: 2000, type: 'error' });
      console.error(e);
    }
  },

  moduleRemoved: async (m) => {
    let item = goosemodScope.settings.items.find((x) => x[1] === 'Module Store')[2].find((x) => x.subtext === m.description);
    
    if (item === undefined) return;

    item.buttonType = 'brand';
    item.buttonText = 'Import';
    item.showToggle = false;
  },

  parseAuthors: async (a) => {
    let authors = [];

    if (typeof a === "string") {
      authors = a.split(', ');
    } else if (Array.isArray(a)) {
      authors = a;
    };
    
    return (await Promise.all(authors.map(async (x) => {
      if (x.match(/^[0-9]{18}$/)) { // "<id>"
        const result = await goosemodScope.webpackModules.findByProps('getUser', 'fetchCurrentUser').getUser(x);
        return `<span class="author" style="cursor: pointer;" onmouseover="this.style.color = '#ccc'" onmouseout="this.style.color = '#fff'" onclick="try { window.goosemod.webpackModules.findByProps('open', 'fetchMutualFriends').open('${result.id}') } catch (e) { }">${result.username}<span class="description-3_Ncsb">#${result.discriminator}</span></span>`; // todo
      }

      let idMatch = x.match(/(.*) \(([0-9]{18})\)/); // "<name> (<id>)"
      if (idMatch === null) return `<span class="author">${x}</span>`; // "<name>"

      return `<span class="author" style="cursor: pointer;" onmouseover="this.style.color = '#ccc'" onmouseout="this.style.color = '#fff'" onclick="try { window.goosemod.webpackModules.findByProps('open', 'fetchMutualFriends').open('${idMatch[2]}') } catch (e) { }">${idMatch[1]}</span>`; // todo
    }))).join('<span class="description-3_Ncsb">,</span> ');
  },

  updateStoreSetting: async () => {
    let item = goosemodScope.settings.items.find((x) => x[1] === 'Module Store');

    item[2] = item[2].slice(0, 5);

    for (const m of goosemodScope.moduleStoreAPI.modules.sort((a, b) => a.name.localeCompare(b.name))) {
      item[2].push({
        type: 'card',
        
        tags: m.tags,
        github: m.github,
        images: m.images,

        buttonType: goosemodScope.modules[m.name] ? 'danger' : 'brand',
        showToggle: goosemodScope.modules[m.name],

        text: `${m.name} <span class="description-3_Ncsb">by</span> ${await goosemodScope.moduleStoreAPI.parseAuthors(m.authors)}`, // ` <span class="description-3_Ncsb">(v${m.version})</span>`,
        subtext: m.description,
        subtext2: `v${m.version}`,

        buttonText: goosemodScope.modules[m.name] ? 'Remove' : 'Import',
        onclick: async (el) => {
          if (goosemodScope.modules[m.name] || goosemodScope.disabledModules[m.name]) {
            el.textContent = 'Removing...';

            goosemodScope.settings.removeModuleUI(m.name, 'Module Store');

            return;
          }

          el.textContent = 'Importing...';

          if (m.dependencies && m.dependencies.length > 0) { // If it's the initial (on import) import that means it has been imported before
            const mainWord = m.dependencies.length === 1 ? 'dependency' : 'dependencies';

            const toContinue = await goosemod.confirmDialog('Continue',
              `${m.name} has ${m.dependencies.length === 1 ? 'a ' : ''}${mainWord}`,
              `**${m.name}** has **${m.dependencies.length}** ${mainWord}:
${m.dependencies.map((x) => ` - **${x}**\n`)}
To continue importing this module the dependencies need to be imported.`,
              undefined,
              'brand');

            if (!toContinue) return;

            for (const d of m.dependencies) {
              await goosemodScope.moduleStoreAPI.importModule(d);
            }
          }

          await goosemodScope.moduleStoreAPI.importModule(m.name);

          goosemodScope.settings.openSettingItem('Module Store');
        },
        isToggled: () => goosemodScope.modules[m.name] !== undefined,
        onToggle: async (checked, el) => {
          if (checked) {
            goosemodScope.modules[m.name] = Object.assign({}, goosemodScope.disabledModules[m.name]);
            delete goosemodScope.disabledModules[m.name];

            await goosemodScope.modules[m.name].goosemodHandlers.onImport();

            if (goosemodScope.modules[m.name].goosemodHandlers.onLoadingFinished !== undefined) {
              await goosemodScope.modules[m.name].goosemodHandlers.onLoadingFinished();
            }

            goosemodScope.loadSavedModuleSetting(m.name);
          } else {
            goosemodScope.disabledModules[m.name] = Object.assign({}, goosemodScope.modules[m.name]);

            goosemodScope.modules[m.name].goosemodHandlers.onRemove();

            delete goosemodScope.modules[m.name];
          }

          goosemodScope.settings.openSettingItem('Module Store');
        }
      });
    }
  }
}
