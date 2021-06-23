import { sha512 } from '../util/hash';

import * as JSCache from './jsCache';
import * as IDCache from './idCache';

let goosemodScope = {};

export default {
  setThisScope: (scope) => {
    goosemodScope = scope;

    JSCache.setThisScope(scope);
    IDCache.setThisScope(scope);
  },

  modules: [],
  repos: [],

  apiBaseURL: 'https://api.goosemod.com',
  storeApiBaseURL: 'https://store.goosemod.com',

  jsCache: JSCache,
  idCache: IDCache,

  repoURLs: undefined,

  getSettingItemName: (moduleInfo) => {
    let item = goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins;

    if (moduleInfo.tags.includes('theme')) item = goosemodScope.i18n.goosemodStrings.settings.itemNames.themes;

    return item;
  },

  hotupdate: async (shouldHandleLoadingText = false) => { // Update repos, hotreload any updated modules (compare hashes to check if updated)
    await goosemodScope.moduleStoreAPI.updateModules(shouldHandleLoadingText);
  
    await goosemodScope.moduleStoreAPI.updateStoreSetting();

    const updatePromises = [];

    for (const m in goosemodScope.modules) {
      const msHash = goosemodScope.moduleStoreAPI.modules.find((x) => x.name === m)?.hash;

      const cacheHash = goosemodScope.moduleStoreAPI.jsCache.getCache()[m]?.hash;

      if (msHash === undefined || cacheHash === undefined || msHash === cacheHash) continue;

      // New update for it, cached JS != repo JS hashes
      if (shouldHandleLoadingText) goosemodScope.updateLoadingScreen(`Updating modules...\n${m}`);

      updatePromises.push(goosemodScope.moduleStoreAPI.importModule(m, goosemodScope.moduleSettingsStore.checkDisabled(m)).then(async () => {
        goosemodScope.showToast(`Updated ${m}`, { timeout: 5000, type: 'success', subtext: 'GooseMod Store' })
      }));
    }

    await Promise.all(updatePromises);
  },

  initRepoURLs: () => {
    goosemodScope.moduleStoreAPI.repoURLs = JSON.parse(localStorage.getItem('goosemodRepos')) || [
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
      },
      {
        url: `https://store.goosemod.com/pcthemes.json`,
        enabled: true
      },

      {
        url: `https://store.goosemod.com/pcplugins.json`,
        enabled: true
      }
    ];
  },

  updateModules: async (shouldHandleLoadingText = false) => {
    goosemodScope.moduleStoreAPI.modules = [];
    goosemodScope.moduleStoreAPI.repos = [];

    await Promise.all(goosemodScope.moduleStoreAPI.repoURLs.map(async (repo) => {
      try {
        if (shouldHandleLoadingText) {
          goosemodScope.updateLoadingScreen(`Getting modules...\n(${repo.url})`);
        }

        const resp = (await (await fetch(`${repo.url}?_=${Date.now()}`)).json());

        if (repo.enabled) {
          goosemodScope.moduleStoreAPI.modules = goosemodScope.moduleStoreAPI.modules.concat(resp.modules.map((x) => {
            x.repo = repo.url;
            return x;
          })).sort((a, b) => a.name.localeCompare(b.name));
        }

        goosemodScope.moduleStoreAPI.repos.push({
          url: repo.url,

          meta: resp.meta,
          enabled: repo.enabled
        });
      } catch (e) { // Failed fetching repo - do not error out and cause loading lockup
        goosemodScope.showToast(`Failed to get repo: ${repo.url}`, { timeout: 5000, type: 'error', subtext: 'GooseMod Store' }); // Show error toast to user so they know
      }
    }));

    const pureRepoUrls = goosemodScope.moduleStoreAPI.repoURLs.map((x) => x.url);

    goosemodScope.moduleStoreAPI.repos = goosemodScope.moduleStoreAPI.repos.sort((a, b) => pureRepoUrls.indexOf(a.url) - pureRepoUrls.indexOf(b.url));


    localStorage.setItem('goosemodRepos', JSON.stringify(goosemodScope.moduleStoreAPI.repoURLs));
    localStorage.setItem('goosemodCachedModules', JSON.stringify(goosemodScope.moduleStoreAPI.modules));
  },

  importModule: async (moduleName, disabled = false) => {
    try {
      const moduleInfo = goosemodScope.moduleStoreAPI.modules.find((x) => x.name === moduleName);

      const jsCode = await goosemodScope.moduleStoreAPI.jsCache.getJSForModule(moduleName);

      const calculatedHash = await sha512(jsCode);
      if (calculatedHash !== moduleInfo.hash) {
        goosemodScope.showToast(`Cancelled importing of ${moduleName} due to hash mismatch`, { timeout: 2000, type: 'danger', subtext: 'GooseMod Store' });

        console.warn('Hash mismatch', calculatedHash, moduleInfo.hash);
        return;
      }

      await goosemodScope.importModule({
        name: moduleName,
        data: jsCode,
        metadata: moduleInfo
      }, disabled);

      if (!disabled) {
        if (goosemodScope.modules[moduleName].goosemodHandlers.onLoadingFinished !== undefined) {
          await goosemodScope.modules[moduleName].goosemodHandlers.onLoadingFinished();
        }

        await goosemodScope.moduleSettingsStore.loadSavedModuleSetting(moduleName);
      }

      try {
        const item = goosemodScope.settings.items.find((x) => x[1] === goosemodScope.moduleStoreAPI.getSettingItemName(moduleInfo))[2].find((x) => x.subtext === moduleInfo.description);

        item.buttonType = 'danger';
        item.buttonText = goosemodScope.i18n.discordStrings.REMOVE;
        item.showToggle = true;
      } catch (e) {
        goosemodScope.logger.debug('import', 'Failed to change setting during MS importModule (likely during initial imports so okay)');
      }

      // If themes / plugins open
      if (document.querySelector(`#gm-settings-inject`)) {
        const cardEls = [...document.querySelectorAll(`.title-31JmR4 + .colorStandard-2KCXvj`)].filter((x) => x.textContent === moduleInfo.description).map((x) => x.parentElement);

        if (cardEls.length === 0) return;

        for (const cardEl of cardEls) {
          const buttonEl = cardEl.querySelector(`.colorBrand-3pXr91`);

          buttonEl.className = buttonEl.className.replace('lookFilled-1Gx00P colorBrand-3pXr91', 'lookOutlined-3sRXeN colorRed-1TFJan');
          buttonEl.textContent = goosemodScope.i18n.discordStrings.REMOVE;

          const toggleEl = cardEl.querySelector(`.container-3auIfb`);
          toggleEl.style.display = 'block';
        }
      }

      // if (goosemodScope.settings.isSettingsOpen() && !goosemodScope.initialImport) goosemodScope.settings.createFromItems();
    } catch (e) {
      goosemodScope.showToast(`Failed to import module ${moduleName}`, { timeout: 2000, type: 'error', subtext: 'GooseMod Store' });
      console.error(e);
    }
  },

  moduleRemoved: (m) => {
    let item = goosemodScope.settings.items.find((x) => x[1] === goosemodScope.moduleStoreAPI.getSettingItemName(m))[2].find((x) => x.subtext === m.description);
    
    if (item === undefined) return;

    item.buttonType = 'brand';
    item.buttonText = goosemodScope.i18n.goosemodStrings.moduleStore.card.button.import;
    item.showToggle = false;

    // If themes / plugins open
    if (document.querySelector(`#gm-settings-inject`)) {
      const cardEls = [...document.querySelectorAll(`.title-31JmR4 + .colorStandard-2KCXvj`)].filter((x) => x.textContent === m.description).map((x) => x.parentElement);

      if (cardEls.length === 0) return;

      for (const cardEl of cardEls) {
        const buttonEl = cardEl.querySelector(`.colorRed-1TFJan`);

        buttonEl.className = buttonEl.className.replace('lookOutlined-3sRXeN colorRed-1TFJan', 'lookFilled-1Gx00P colorBrand-3pXr91');
        buttonEl.textContent = goosemodScope.i18n.goosemodStrings.moduleStore.card.button.import;

        const toggleEl = cardEl.querySelector(`.container-3auIfb`);
        toggleEl.style.display = 'none';
      }
    }
  },

  parseAuthors: async (a) => {
    let authors = [];

    if (typeof a === "string") {
      authors = a.split(', ');
    } else if (Array.isArray(a)) {
      authors = a;
    };
    
    return (await Promise.all(authors.map(async (x, i) => {
      if (x.match(/^[0-9]{17,18}$/)) { // "<id>"
        const result = await IDCache.getDataForID(x);

        const pfp = `<img style="display: inline; border-radius: 50%; margin-right: 5px; vertical-align: bottom;" src="https://cdn.discordapp.com/avatars/${result.id}/${result.avatar}.png?size=32">`;
        const name = `<span class="author" style="cursor: pointer; line-height: 32px;" onmouseover="this.style.color = '#ccc'" onmouseout="this.style.color = '#fff'" onclick="try { window.goosemod.webpackModules.findByProps('open', 'fetchMutualFriends').open('${result.id}') } catch (e) { }">${result.username}`; //<span class="description-3_Ncsb">#${result.discriminator}</span></span>`;

        return i > 1 ? pfp : pfp + name;
      }

      let idMatch = x.match(/(.*) \(([0-9]{17,18})\)/); // "<name> (<id>)"
      if (idMatch === null) return `<span class="author">${x}</span>`; // "<name>"

      return `<span class="author" style="cursor: pointer;" onmouseover="this.style.color = '#ccc'" onmouseout="this.style.color = '#fff'" onclick="try { window.goosemod.webpackModules.findByProps('open', 'fetchMutualFriends').open('${idMatch[2]}') } catch (e) { }">${idMatch[1]}</span>`; // todo
    }))).join('<span class="description-3_Ncsb">,</span> ');
  },

  updateStoreSetting: async () => {
    let allItems = goosemodScope.settings.items.filter((x) => x[1] === goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins || x[1] === goosemodScope.i18n.goosemodStrings.settings.itemNames.themes);

    for (const i of allItems) {
      i[2] = i[2].filter((x) => x.type !== 'card');
    }

    for (const m of goosemodScope.moduleStoreAPI.modules) {
      const itemName = goosemodScope.moduleStoreAPI.getSettingItemName(m);
      const item = allItems.find((x) => x[1] === itemName);

      item[2].push({
        type: 'card',
        
        tags: m.tags,
        github: m.github,
        images: m.images?.map((x) => {
          if (x.startsWith('/')) {
            const baseUrl = m.repo.split('/').slice(0, -1).join('/');
            x = baseUrl + x;
          }

          return x;
        }),
        lastUpdated: m.lastUpdated,

        buttonType: goosemodScope.modules[m.name] || goosemodScope.disabledModules[m.name] ? 'danger' : 'brand',
        showToggle: goosemodScope.modules[m.name] || goosemodScope.disabledModules[m.name],

        name: m.name,
        author: await goosemodScope.moduleStoreAPI.parseAuthors(m.authors),

        subtext: m.description,
        subtext2: m.version === '0' || m.version.toLowerCase().includes('auto') ? '' : `v${m.version}`,

        buttonText: goosemodScope.modules[m.name] || goosemodScope.disabledModules[m.name] ? goosemodScope.i18n.discordStrings.REMOVE : goosemodScope.i18n.goosemodStrings.moduleStore.card.button.import,
        onclick: async () => {
          if (goosemodScope.modules[m.name] || goosemodScope.disabledModules[m.name]) {
            // el.textContent = goosemodScope.i18n.goosemodStrings.moduleStore.card.button.removing;

            goosemodScope.settings.removeModuleUI(m.name, itemName);

            return;
          }

          // el.textContent = goosemodScope.i18n.goosemodStrings.moduleStore.card.button.importing;

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
        },
        isToggled: () => goosemodScope.disabledModules[m.name] === undefined,
        onToggle: async (checked) => {
          if (checked) {
            goosemodScope.modules[m.name] = Object.assign({}, goosemodScope.disabledModules[m.name]);
            delete goosemodScope.disabledModules[m.name];

            await goosemodScope.modules[m.name].goosemodHandlers.onImport();

            if (goosemodScope.modules[m.name].goosemodHandlers.onLoadingFinished !== undefined) {
              await goosemodScope.modules[m.name].goosemodHandlers.onLoadingFinished();
            }

            await goosemodScope.moduleSettingsStore.loadSavedModuleSetting(m.name);

            goosemodScope.moduleSettingsStore.enableModule(m.name);
          } else {
            goosemodScope.disabledModules[m.name] = Object.assign({}, goosemodScope.modules[m.name]);

            await goosemodScope.modules[m.name].goosemodHandlers.onRemove();

            delete goosemodScope.modules[m.name];

            goosemodScope.moduleSettingsStore.disableModule(m.name);
          }
        }
      });
    }
  }
}
