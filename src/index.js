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

import * as i18n from './i18n';

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

  confirmDialog.setThisScope,

  i18n.setThisScope
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
  reactUtils: ReactUtils,

  i18n
};

const init = async function () {
  while (document.querySelectorAll('.flex-1xMQg5.flex-1O1GKY.horizontal-1ae9ci.horizontal-2EEEnY.flex-1O1GKY.directionRow-3v3tfG.justifyStart-2NDFzi.alignStretch-DpGPf3.noWrap-3jynv6 > [type="button"]:last-child').length === 0 || window.webpackJsonp === undefined) {
    await sleep(10);
  }

  Object.assign(this, importsToAssign);

  fixLocalStorage();

  let a = 1;
  for (let x of scopeSetterFncs) {
    x(this);

    a++;
  };

  this.versioning = {
    version: '8.0.0-dev',
    hash: '<hash>', // Hash of built final js file is inserted here via build script

    lastUsedVersion: localStorage.getItem('goosemodLastVersion')
  };

  this.versioning.isDeveloperBuild = this.versioning.hash === '<hash>';

  localStorage.setItem('goosemodLastVersion', this.versioning.version);

  this.logger.debug('import.version.goosemod', `${this.versioning.version} (${this.versioning.hash})`);

  if (window.DiscordNative !== undefined) this.logger.debug('import.version.discord', `${DiscordNative.app.getReleaseChannel()} ${DiscordNative.app.getVersion()}`);
  
  if (window.gmUntethered) {
    this.untetheredVersion = window.gmUntethered.slice();
  }

  if (this.lastVersion && this.lastVersion !== this.version) {
    if (this.version === '8.0.0' && localStorage.getItem('goosemodRepos')) { // Adding new PC themes repo
      const current = JSON.parse(localStorage.getItem('goosemodRepos'));

      if (!current.find((x) => x.url === `https://store.goosemod.com/pcplugins.json`)) current.push({
        url: `https://store.goosemod.com/pcplugins.json`,
        enabled: true
      });

      localStorage.setItem('goosemodRepos', JSON.stringify(current));

      this.moduleStoreAPI.initRepoURLs();

      this.showToast(`Added new PC Plugins Repo (v8.0.0 update)`);
    }

    this.goosemodChangelog.show(); // Show changelog if last GooseMod version is different than this version
  }

  this.startLoadingScreen();

  this.updateLoadingScreen('Initialising internals...');
  // this.updateLoadingScreen('Getting i18n data...');

  // Wait for i18n to load
  (new Promise(async (res) => {
    while (!this.i18n.goosemodStrings || !this.i18n.discordStrings) {
      await sleep(10);
    }

    res();
  })).then(() => {
    this.moduleStoreAPI.updateStoreSetting();
    this.settings.makeGooseModSettings();
  });

  this.moduleStoreAPI.initRepoURLs();

  this.removed = false;

  this.modules = {};
  this.disabledModules = {};

  this.moduleStoreAPI.modules = JSON.parse(localStorage.getItem('goosemodCachedModules')) || [];

  let toInstallModules = Object.keys(JSON.parse(localStorage.getItem('goosemodModules')) || {});
  let toInstallIsDefault = false;
  
  if (toInstallModules.length === 0) {
    toInstallIsDefault = true;
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
      this.updateLoadingScreen(`Importing modules from Module Store...\n${m}`);

      // await this.moduleStoreAPI.importModule(m);
      importPromises.push(this.moduleStoreAPI.importModule(m, this.moduleSettingsStore.checkDisabled(m)));
    }

    await Promise.all(importPromises);
  }

  this.messageEasterEggs.interval = setInterval(this.messageEasterEggs.check, 1000);
  
  this.saveInterval = setInterval(this.moduleSettingsStore.saveModuleSettings, 3000);
  
  this.remove = () => {
    this.settingsUninjects.forEach((x) => x());

    clearInterval(this.messageEasterEggs.interval);
    clearInterval(this.saveInterval);
    clearInterval(this.i18nCheckNewLangInterval);
    
    localStorage.removeItem('goosemodLastVersion');
    localStorage.removeItem('goosemodGMSettings');

    localStorage.removeItem('goosemodRepos');
    localStorage.removeItem('goosemodCachedModules');

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

  await this.moduleStoreAPI.updateModules(true);
  
  await this.moduleStoreAPI.updateStoreSetting();

  const updatePromises = [];

  for (const m in this.modules) {
    const msHash = this.moduleStoreAPI.modules.find((x) => x.name === m)?.hash;

    const cacheHash = this.moduleStoreAPI.jsCache.getCache()[m]?.hash;

    if (msHash === undefined || cacheHash === undefined || msHash === cacheHash) continue;

    // New update for it, cached JS != repo JS hashes
    this.updateLoadingScreen(`Updating modules...\n${m}`);

    updatePromises.push(this.moduleStoreAPI.importModule(m, this.moduleSettingsStore.checkDisabled(m)).then(async () => {
      this.showToast(`Updated ${m}`, { timeout: 5000, type: 'success' })
    }));
  }

  await Promise.all(updatePromises);

  if (window.gmSafeMode && !(await triggerSafeMode())) { // TODO: where in injection process?
    this.stopLoadingScreen();
    this.showToast();

    return;
  }
  
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
