import sleep from './util/sleep';

import * as Logger from './util/logger';

import WebpackModules from './util/discord/webpackModules';
import fixLocalStorage from './util/discord/fixLocalStorage';

import * as Patcher from './util/patcher';
import * as Attrs from './util/attrs';
import * as ReactUtils from './util/react';

import showToast from './ui/toast';
import * as confirmDialog from './ui/modals/confirm';

import * as Changelog from './ui/modals/changelog';
import * as GoosemodChangelog from './ui/goosemodChangelog';

import * as PackModal from './ui/packModal';

import { startLoadingScreen, stopLoadingScreen, updateLoadingScreen, setThisScope as setThisScope1 } from './ui/loading';

import * as Settings from './ui/settings';

import { importModule, setThisScope as setThisScope3 } from './moduleManager';
// import { saveModuleSettings, clearModuleSetting, clearSettings, loadSavedModuleSetting, loadSavedModuleSettings, setThisScope as setThisScope4 } from './moduleSettingsStore';
import * as ModuleSettingsStore from './moduleSettingsStore';

import moduleStoreAPI from './moduleStore';

import * as i18n from './i18n';

import * as CSSCache from './cssCache';

import * as GMBadges from './gmBadges';

const scopeSetterFncs = [
  setThisScope1,
  Settings.setThisScope,
  setThisScope3,

  moduleStoreAPI.setThisScope,

  Changelog.setThisScope,
  GoosemodChangelog.setThisScope,

  PackModal.setThisScope,
  Patcher.setThisScope,
  Attrs.setThisScope,

  ModuleSettingsStore.setThisScope,

  confirmDialog.setThisScope,

  i18n.setThisScope,
  CSSCache.setThisScope,

  GMBadges.setThisScope
];

const importsToAssign = {
  startLoadingScreen,
  stopLoadingScreen,
  updateLoadingScreen,

  settings: Settings,

  importModule,

  moduleSettingsStore: ModuleSettingsStore,

  webpackModules: WebpackModules,
  logger: Logger,

  showToast,
  confirmDialog: confirmDialog.show,
  moduleStoreAPI,

  changelog: Changelog,
  goosemodChangelog: GoosemodChangelog,

  packModal: PackModal,

  patcher: Patcher,
  attrs: Attrs,
  reactUtils: ReactUtils,

  i18n,

  cssCache: CSSCache,

  gmBadges: GMBadges
};

const init = async function () {
  Object.assign(this, importsToAssign);

  fixLocalStorage();

  this.cssCache.load();

  while (document.querySelectorAll('.flex-1xMQg5.flex-1O1GKY.horizontal-1ae9ci.horizontal-2EEEnY.flex-1O1GKY.directionRow-3v3tfG.justifyStart-2NDFzi.alignStretch-DpGPf3.noWrap-3jynv6 > [type="button"]:last-child').length === 0 || window.webpackJsonp === undefined) {
    await sleep(10);
  }

  for (let x of scopeSetterFncs) {
    await x(this);
  }

  this.versioning = {
    version: '9.0.0-dev',
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

  if (this.versioning.lastUsedVersion && this.versioning.version !== this.versioning.lastUsedVersion) {
    this.goosemodChangelog.show(); // Show changelog if last GooseMod version is different than this version
  }

  this.startLoadingScreen();

  this.updateLoadingScreen('Getting i18n data...');
  await this.i18n.checkForNewLang();

  this.updateLoadingScreen('Initialising internals...');

  this.moduleStoreAPI.updateStoreSetting();
  this.settings.makeGooseModSettings();

  this.moduleStoreAPI.initRepoURLs();

  this.removed = false;

  this.modules = {};
  this.disabledModules = {};

  this.moduleStoreAPI.modules = JSON.parse(localStorage.getItem('goosemodCachedModules')) || [];

  if (!localStorage.getItem('goosemodCachedModules')) { // If not cached, fetch latest repos
    await this.moduleStoreAPI.updateModules(true);
  }

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

  this.cssCache.removeStyle();

  if (this.settings.gmSettings.get().gmBadges) this.gmBadges.addBadges();
  if (this.settings.gmSettings.get().attrs) this.attrs.patch();
  
  this.saveInterval = setInterval(() => {
    this.cssCache.save();
    this.moduleSettingsStore.saveModuleSettings();
  }, 3000);
  
  this.remove = () => {
    this.settingsUninjects.forEach((x) => x());

    clearInterval(this.saveInterval);
    clearInterval(this.i18nCheckNewLangInterval);
    clearInterval(this.hotupdateInterval);
    
    Object.keys(localStorage).filter((x) => x.toLowerCase().startsWith('goosemod')).forEach((x) => localStorage.removeItem(x));
    
    this.removed = true;
    
    for (let p in this.modules) {
      if (this.modules.hasOwnProperty(p) && this.modules[p].goosemodHandlers.onRemove !== undefined) {
        try {
          this.modules[p].goosemodHandlers.onRemove();
        } catch (e) { }
      }
    }
  };

  this.moduleStoreAPI.hotupdate(true);

   // Hotupdate every hour
  this.hotupdateInterval = setInterval(() => {
    if (!this.settings.gmSettings.get().autoupdate) return; // Check main GM setting

    this.moduleStoreAPI.hotupdate();
  }, 1000 * 60 * 60);
  
  this.stopLoadingScreen();
  
  if (this.settings.isSettingsOpen()) { // If settings are open, reopen to inject new GooseMod options
    this.settings.reopenSettings();
  } else {
    // Only open settings (when not already open) if new user
    if (!localStorage.getItem('goosemodModules')) {
      this.settings.openSettings();
      
      await sleep(200);
      
      this.settings.openSettingItem('Module Store');
    }
  }
};

window.goosemod = {};
init.bind(window.goosemod)();