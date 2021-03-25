import sleep from './util/sleep';

import * as Logger from './util/logger';

import WebpackModules from './util/discord/webpackModules';
import fixLocalStorage from './util/discord/fixLocalStorage';

import * as Patcher from './util/patcher';
import * as ReactUtils from './util/react';

import showToast from './ui/toast';
import * as confirmDialog from './ui/modals/confirm';

import * as Changelog from './ui/modals/changelog';
import * as GoosemodChangelog from './ui/goosemodChangelog';

import * as PackModal from './ui/packModal';

import { startLoadingScreen, stopLoadingScreen, updateLoadingScreen, setThisScope as setThisScope1 } from './ui/loading';

import * as Settings from './ui/settings';

import easterEggs from './ui/easterEggs';

import { importModule, setThisScope as setThisScope3 } from './moduleManager';
// import { saveModuleSettings, clearModuleSetting, clearSettings, loadSavedModuleSetting, loadSavedModuleSettings, setThisScope as setThisScope4 } from './moduleSettingsStore';
import * as ModuleSettingsStore from './moduleSettingsStore';

import moduleStoreAPI from './moduleStore';

import triggerSafeMode from './safeMode';

const scopeSetterFncs = [
  setThisScope1,
  Settings.setThisScope,
  setThisScope3,

  moduleStoreAPI.setThisScope,
  easterEggs.setThisScope,

  Changelog.setThisScope,
  GoosemodChangelog.setThisScope,

  PackModal.setThisScope,
  Patcher.setThisScope,

  ModuleSettingsStore.setThisScope,

  confirmDialog.setThisScope
];

const importsToAssign = {
  startLoadingScreen,
  stopLoadingScreen,
  updateLoadingScreen,

  settings: Settings,

  importModule,

  moduleSettingsStore: ModuleSettingsStore,

  webpackModules: WebpackModules,
  messageEasterEggs: easterEggs,
  logger: Logger,

  showToast,
  confirmDialog: confirmDialog.show,
  moduleStoreAPI,

  changelog: Changelog,
  goosemodChangelog: GoosemodChangelog,

  packModal: PackModal,

  patcher: Patcher,
  reactUtils: ReactUtils
};

const init = async function () {
  while (document.querySelectorAll('.flex-1xMQg5.flex-1O1GKY.horizontal-1ae9ci.horizontal-2EEEnY.flex-1O1GKY.directionRow-3v3tfG.justifyStart-2NDFzi.alignStretch-DpGPf3.noWrap-3jynv6 > [type="button"]:last-child').length === 0 || window.webpackJsonp === undefined) {
    await sleep(50);
  }

  Object.assign(this, importsToAssign);

  fixLocalStorage();

  let a = 1;
  for (let x of scopeSetterFncs) {
    x(this);

    a++;
  };

  this.settings.makeGooseModSettings();
  this.moduleStoreAPI.initRepoURLs();

  this.removed = false;

  this.modules = {};
  this.disabledModules = {};

  this.versioning = {
    version: 'v7.3.0-dev',
    hash: '<hash>', // Hash of built final js file is inserted here via build script
    lastUsedVersion: localStorage.getItem('goosemodLastVersion')
  };

  fetch(`${this.moduleStoreAPI.apiBaseURL}/injectVersion.json`).then((x) => x.json().then((latestInjectVersionInfo) => {
    if (latestInjectVersionInfo.version !== this.versioning.version) {
      this.showToast('Warning: Version number does not match latest public release', { timeout: 3000, type: 'danger' });
    }

    if (latestInjectVersionInfo.hash !== this.versioning.hash) {
      this.showToast('Warning: Version hash does not match latest public release', { timeout: 3000, type: 'danger' });
    }
  }));


  if (this.lastVersion && this.lastVersion !== this.versioning.version) {
    if (this.versioning.version === '7.2.0' && localStorage.getItem('goosemodRepos')) { // Adding new PC themes repo
      const current = JSON.parse(localStorage.getItem('goosemodRepos'));

      if (!current.find((x) => x.url === `https://store.goosemod.com/pcthemes.json`)) current.push({
        url: `https://store.goosemod.com/pcthemes.json`,
        enabled: true
      });

      localStorage.setItem('goosemodRepos', JSON.stringify(current));

      this.moduleStoreAPI.initRepoURLs();

      this.showToast(`Added new PC Themes Repo (v7.2.0 update)`);
    }

    this.goosemodChangelog.show();
  }

  localStorage.setItem('goosemodLastVersion', this.versioning.version);

  this.logger.debug('import.version.goosemod', `${this.versioning.version} (${this.versioning.hash})`);

  if (window.DiscordNative !== undefined) this.logger.debug('import.version.discord', `${DiscordNative.app.getReleaseChannel()} ${DiscordNative.app.getVersion()}`);
  
  if (window.gmUntethered) {
    this.untetheredVersion = window.gmUntethered.slice();
    
    // delete window.gmUntethered;
  }

  this.messageEasterEggs.interval = setInterval(this.messageEasterEggs.check, 1000);
  
  this.saveInterval = setInterval(this.moduleSettingsStore.saveModuleSettings, 3000);
  
  this.remove = () => {
    this.settingsUninjects.forEach((x) => x());

    clearInterval(this.messageEasterEggs.interval);
    clearInterval(this.saveInterval);
    
    localStorage.removeItem('goosemodLastVersion');

    this.moduleSettingsStore.clearSettings();
    this.moduleStoreAPI.jsCache.purgeCache();
    
    this.removed = true;
    
    for (let p in this.modules) {
      if (this.modules.hasOwnProperty(p) && this.modules[p].goosemodHandlers.onRemove !== undefined) {
        try {
          this.modules[p].goosemodHandlers.onRemove();
        } catch (e) { }
      }
    }
  };
  
  this.startLoadingScreen();

  await this.moduleStoreAPI.updateModules(true);
  
  await this.moduleStoreAPI.updateStoreSetting();

  if (window.gmSafeMode && !(await triggerSafeMode())) {
    this.stopLoadingScreen();
    this.showToast();

    return;
  }
  
  this.initialImport = true;
  
  let toInstallModules = Object.keys(JSON.parse(localStorage.getItem('goosemodModules')) || {});
  let toInstallIsDefault = false;
  
  if (toInstallModules.length === 0) {
    toInstallIsDefault = true;
  }
  
  const needToMigrateFromV6 = toInstallModules.some((m) => this.moduleStoreAPI.modules.find((x) => x.name === m) === undefined);

  if (needToMigrateFromV6) {
    this.updateLoadingScreen('Migrating stored module names to MS2...');

    const oldModules = (await (await fetch(`${this.moduleStoreAPI.apiBaseURL}/modules.json?_=${Date.now()}`)).json());

    console.log(oldModules);

    toInstallModules = toInstallModules.map((m) => oldModules.find((x) => x.filename === m)?.name || m);

    let moduleSettings = JSON.parse(localStorage.getItem('goosemodModules'));

    for (const oldName of Object.keys(moduleSettings)) {
      const newName = oldModules.find((x) => x.filename === oldName)?.name;
      if (!newName) continue;

      Object.defineProperty(moduleSettings, newName, Object.getOwnPropertyDescriptor(moduleSettings, oldName));

      delete moduleSettings[oldName];
    }

    localStorage.setItem('goosemodModules', JSON.stringify(moduleSettings));
  }

  toInstallModules = toInstallModules.filter((m) => this.moduleStoreAPI.modules.find((x) => x.name === m) !== undefined);
  
  let themeModule = toInstallModules.find((x) => x.toLowerCase().includes('theme'));
  
  if (themeModule) {
    toInstallModules.unshift(toInstallModules.splice(toInstallModules.indexOf(themeModule), 1)[0]);
  }
  
  let hardcodedColorFixerModule = toInstallModules.find((x) => x === 'Hardcoded Color Fixer');
  
  if (hardcodedColorFixerModule) {
    toInstallModules.unshift(toInstallModules.splice(toInstallModules.indexOf(hardcodedColorFixerModule), 1)[0]);
  }

  if (toInstallIsDefault) {
    await this.packModal.ask();
  } else {
    this.updateLoadingScreen('Importing modules from Module Store...');

    const importPromises = [];

    for (let m of toInstallModules) {
      this.updateLoadingScreen(`${m}\n${toInstallModules.indexOf(m) + 1}/${toInstallModules.length}`);

      // await this.moduleStoreAPI.importModule(m);
      importPromises.push(this.moduleStoreAPI.importModule(m, this.moduleSettingsStore.checkDisabled(m)));
    }

    await Promise.all(importPromises);
  }
  
  delete this.initialImport;
  
  this.updateLoadingScreen(`Loading saved module settings...`);
  
  await this.moduleSettingsStore.loadSavedModuleSettings();
  
  this.stopLoadingScreen();
  
  if (this.settings.isSettingsOpen()) { // If settings are open, reopen to inject new GooseMod options
    this.settings.reopenSettings();
  } else {
    // Only open settings (when not already open) if new user
    if (!localStorage.getItem('goosemodModules')) {
      this.settings.openSettings();
      
      await sleep(200);
      
      this.openSettingItem('Module Store');
    }
  }
};

window.goosemod = {};
init.bind(window.goosemod)();