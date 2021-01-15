import sleep from './util/sleep';

import * as Logger from './util/logger';

import WebpackModules from './util/discord/webpackModules';
import fixLocalStorage from './util/discord/fixLocalStorage';

import * as Patcher from './util/patcher';
import * as ReactUtils from './util/react';

import showToast from './ui/toast';
import confirmDialog from './ui/modals/confirm';

import * as Changelog from './ui/modals/changelog';
import * as GoosemodChangelog from './ui/goosemodChangelog';

import * as PackModal from './ui/packModal';

import { startLoadingScreen, stopLoadingScreen, updateLoadingScreen, setThisScope as setThisScope1 } from './ui/loading';

import * as Settings from './ui/settings';

import easterEggs from './ui/easterEggs';

import { importModule, importModules, bindHandlers, getModuleFiles, importModulesFull, setThisScope as setThisScope3 } from './moduleManager';
import { saveModuleSettings, clearModuleSetting, clearSettings, loadSavedModuleSetting, loadSavedModuleSettings, setThisScope as setThisScope4 } from './moduleSettingsStore';

import moduleStoreAPI from './moduleStore';

import triggerSafeMode from './safeMode';

const scopeSetterFncs = [
  setThisScope1,
  Settings.setThisScope,
  setThisScope3,
  setThisScope4,

  moduleStoreAPI.setThisScope,
  easterEggs.setThisScope,

  Changelog.setThisScope,
  GoosemodChangelog.setThisScope,

  PackModal.setThisScope,
  Patcher.setThisScope
];

const importsToAssign = {
  startLoadingScreen,
  stopLoadingScreen,
  updateLoadingScreen,

  settings: Settings,

  importModule,
  importModules,
  bindHandlers,
  getModuleFiles,
  importModulesFull,

  saveModuleSettings,
  clearModuleSetting,
  clearSettings,
  loadSavedModuleSetting,
  loadSavedModuleSettings,

  webpackModules: WebpackModules,
  messageEasterEggs: easterEggs,
  logger: Logger,

  showToast,
  confirmDialog,
  moduleStoreAPI,

  changelog: Changelog,
  goosemodChangelog: GoosemodChangelog,

  packModal: PackModal,

  patcher: Patcher,
  reactUtils: ReactUtils
};

const init = async function () {
  Object.assign(this, importsToAssign);

  fixLocalStorage();

  let a = 1;
  for (let x of scopeSetterFncs) {
    x(this);

    a++;
  };

  this.settings.makeGooseModSettings();

  this.removed = false;

  this.modules = {};
  this.disabledModules = {};

  this.lastVersion = localStorage.getItem('goosemodLastVersion');
  this.version = '6.0.0-dev-rc-5';
  this.versionHash = '<hash>'; // Hash of built final js file is inserted here via build script

  fetch(`${this.moduleStoreAPI.apiBaseURL}/injectVersion.json`).then((x) => x.json().then((latestInjectVersionInfo) => {
    if (latestInjectVersionInfo.version !== this.version) {
      this.showToast('Warning: Version number does not match latest public release', {timeout: 3000});
    }

    if (latestInjectVersionInfo.hash !== this.versionHash) {
      this.showToast('Warning: Version hash does not match latest public release', {timeout: 3000});
    }
  }));


  if (this.lastVersion && this.lastVersion !== this.version) {
    this.goosemodChangelog.show();
  }

  localStorage.setItem('goosemodLastVersion', this.version);

  this.logger.debug('import.version.goosemod', `${this.version} (${this.versionHash})`);

  if (window.DiscordNative !== undefined) this.logger.debug('import.version.discord', `${DiscordNative.app.getReleaseChannel()} ${DiscordNative.app.getVersion()}`);
  
  if (window.gmUntethered) {
    this.untetheredVersion = window.gmUntethered.slice();
    
    // delete window.gmUntethered;
  }

  this.messageEasterEggs.interval = setInterval(this.messageEasterEggs.check, 1000);
  
  this.saveInterval = setInterval(this.saveModuleSettings, 3000);
  
  this.remove = () => {
    this.patcher.uninject('gm-settings');

    clearInterval(this.messageEasterEggs.interval);
    clearInterval(this.saveInterval);
    
    localStorage.removeItem('goosemodLastVersion');

    this.clearSettings();
    this.moduleStoreAPI.jsCache.purgeCache();
    
    this.removed = true;
    
    for (let p in this.modules) {
      if (this.modules.hasOwnProperty(p) && this.modules[p].remove !== undefined) {
        try {
          this.modules[p].remove();
        } catch (e) { }
      }
    }
  };
  
  this.startLoadingScreen();
  
  this.updateLoadingScreen('Getting module index from Module Store...');
  
  await this.moduleStoreAPI.updateModules();
  
  this.moduleStoreAPI.updateStoreSetting();

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
    // toInstallModules = await this.packModal.ask(); // ['hardcodedColorFixer', 'draculaTheme', 'fucklytics', 'visualTweaks', 'wysiwygMessages', 'customSounds', 'devMode', 'twitchEmotes', 'noMessageDeletion'];
  }
  
  toInstallModules = toInstallModules.filter((m) => this.moduleStoreAPI.modules.find((x) => x.filename === m) !== undefined);
  
  let themeModule = toInstallModules.find((x) => x.toLowerCase().includes('theme'));
  
  if (themeModule) {
    toInstallModules.unshift(toInstallModules.splice(toInstallModules.indexOf(themeModule), 1)[0]);
  }
  
  let hardcodedColorFixerModule = toInstallModules.find((x) => x === 'hardcodedColorFixer');
  
  if (hardcodedColorFixerModule) {
    toInstallModules.unshift(toInstallModules.splice(toInstallModules.indexOf(hardcodedColorFixerModule), 1)[0]);
  }

  if (toInstallIsDefault) {
    await this.packModal.ask();
  } else {
    this.updateLoadingScreen(`Importing default modules from Module Store... (${toInstallIsDefault ? '(Default)' : '(Last Installed)'})`);
  
    for (let m of toInstallModules) {
      this.updateLoadingScreen(`${this.moduleStoreAPI.modules.find((x) => x.filename === m).name} - ${toInstallModules.indexOf(m) + 1}/${toInstallModules.length}`);

      await this.moduleStoreAPI.importModule(m);
    }
  }
  
  delete this.initialImport;
  
  this.updateLoadingScreen(`Loading saved module settings...`);
  
  await this.loadSavedModuleSettings();
  
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
