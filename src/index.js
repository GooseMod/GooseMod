import sleep from './util/sleep';

import * as Logger from './util/logger';

import * as WebpackModules from './util/discord/webpackModules';

import * as Patcher from './util/patcher';
import * as Attrs from './util/attrs';
import * as ReactUtils from './util/react';

import showToast from './ui/toast';
import * as confirmDialog from './ui/modals/confirm';

import * as Changelog from './ui/modals/changelog';
import * as GoosemodChangelog from './ui/goosemodChangelog';

import * as PackModal from './ui/packModal';
import * as OOTB from './ui/ootb';

import { startLoadingScreen, stopLoadingScreen, updateLoadingScreen, setThisScope as setThisScope1 } from './ui/loading';

import * as Settings from './ui/settings';

import { importModule, setThisScope as setThisScope3 } from './moduleManager';
// import { saveModuleSettings, clearModuleSetting, clearSettings, loadSavedModuleSetting, loadSavedModuleSettings, setThisScope as setThisScope4 } from './moduleSettingsStore';
import * as ModuleSettingsStore from './moduleSettingsStore';

import moduleStoreAPI from './moduleStore';

import * as i18n from './i18n';

import * as CSSCache from './cssCache';

import * as GMBadges from './gmBadges';

import Storage from './storage';

import ProfileStoreInit from './gmProfileStore';

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

  gmBadges: GMBadges,

  ootb: OOTB,
  storage: Storage
};

const init = async function () {
  Object.assign(this, importsToAssign);

  this.cssCache.load();

  while (document.querySelectorAll('.flex-1xMQg5.flex-1O1GKY.horizontal-1ae9ci.horizontal-2EEEnY.flex-1O1GKY.directionRow-3v3tfG.justifyStart-2NDFzi.alignStretch-DpGPf3.noWrap-3jynv6 > [type="button"]:last-child').length === 0 || window.webpackJsonp === undefined) {
    await sleep(10);
  }

  for (let x of scopeSetterFncs) {
    await x(this);
  }

  this.versioning = {
    version: `11.0`,
    hash: '<hash>', // Hash of built final js file is inserted here via build script

    lastUsedVersion: this.storage.get('goosemodLastVersion')
  };

  this.versioning.isDeveloperBuild = this.versioning.hash === '<hash>';

  this.storage.set('goosemodLastVersion', this.versioning.version);

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

  let toInstallModules = Object.keys(JSON.parse(this.storage.get('goosemodModules')) || {});
  let disabledModules = Object.keys(JSON.parse(this.storage.get('goosemodDisabled')) || {});

  this.modules = toInstallModules.filter((x) => disabledModules.indexOf(x) === -1).reduce((acc, v) => { acc[v] = { goosemodHandlers: { } }; return acc; }, {});
  this.disabledModules = toInstallModules.filter((x) => disabledModules.indexOf(x) !== -1).reduce((acc, v) => { acc[v] = { goosemodHandlers: { } }; return acc; }, {});

  this.moduleStoreAPI.modules = JSON.parse(this.storage.get('goosemodCachedModules')) || [];
  this.moduleStoreAPI.modules.cached = true;
  
  this.settings.makeGooseModSettings();

  await this.moduleStoreAPI.initRepos();

  this.removed = false;

  if (!this.storage.get('goosemodCachedModules')) { // If not cached, fetch latest repos
    await this.moduleStoreAPI.updateModules(true);
  }


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
    // await this.packModal.ask();
    toInstallModules = ['Fucklytics', 'Custom CSS']; // Base modules
  }

  this.updateLoadingScreen('Importing modules from Store...');

  const importPromises = [];

  for (let m of toInstallModules) {
    // await this.moduleStoreAPI.importModule(m);
    importPromises.push(this.moduleStoreAPI.importModule(m, disabledModules.includes(m)));
  }

  await Promise.all(importPromises);


  this.cssCache.removeStyle();

  if (this.settings.gmSettings.get().gmBadges) this.gmBadges.addBadges();
  if (this.settings.gmSettings.get().attrs) this.attrs.patch();
  
  this.saveInterval = setInterval(() => {
    this.moduleSettingsStore.saveModuleSettings();
  }, 3000);
  
  this.remove = () => {
    this.settingsUninjects.forEach((x) => x());

    clearInterval(this.saveInterval);
    clearInterval(this.i18nCheckNewLangInterval);
    clearInterval(this.hotupdateInterval);
    
    this.storage.keys().filter((x) => x.toLowerCase().startsWith('goosemod')).forEach((x) => this.storage.remove(x));
    
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
  }

  if (!this.storage.get('goosemodOOTB')) { // First time install
    await sleep(1000); // Wait for slowdown / Discord loading to ease

    while (document.querySelector('.modal-3O0aXp')) { // Wait for modals to close (GM changelog, etc)
      await sleep(100);
    }

    this.ootb.start();

    this.storage.set('goosemodOOTB', true);
  }


  ProfileStoreInit();
};

window.goosemod = {};
init.bind(window.goosemod)();