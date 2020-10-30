import sleep from './util/sleep';

import * as Logger from './util/logger';

import WebpackModules from './util/discord/webpackModules';
import fixLocalStorage from './util/discord/fixLocalStorage';

import cspBypasser from './util/discord/cspBypasser';

import showToast from './ui/toast';
import confirmDialog from './ui/modals/confirm';

import * as Changelog from './ui/modals/changelog';
import * as GoosemodChangelog from './ui/goosemodChangelog';

import { startLoadingScreen, stopLoadingScreen, updateLoadingScreen, setThisScope as setThisScope1 } from './ui/loading';

import * as Settings from './ui/settings';

// import { removeModuleUI, isSettingsOpen, closeSettings, openSettings, openSettingItem, reopenSettings, injectInSettings, checkSettingsOpenInterval, makeGooseModSettings, setThisScope as setThisScope2 } from './ui/settings';

import easterEggs from './ui/easterEggs';

import { importModule, importModules, bindHandlers, getModuleFiles, importModulesFull, setThisScope as setThisScope3 } from './moduleManager';
import { saveModuleSettings, clearModuleSetting, clearSettings, loadSavedModuleSetting, loadSavedModuleSettings, setThisScope as setThisScope4 } from './moduleSettingsStore';

import moduleStoreAPI from './moduleStore';

const scopeSetterFncs = [
  setThisScope1,
  Settings.setThisScope, // setThisScope2,
  setThisScope3,
  setThisScope4,

  moduleStoreAPI.setThisScope,
  cspBypasser.setThisScope,
  easterEggs.setThisScope,

  Changelog.setThisScope,
  GoosemodChangelog.setThisScope
];

const importsToAssign = {
  startLoadingScreen,
  stopLoadingScreen,
  updateLoadingScreen,

  settings: Settings, /* removeModuleUI,
  isSettingsOpen,
  closeSettings,
  openSettings,
  openSettingItem,
  reopenSettings,
  injectInSettings,
  checkSettingsOpenInterval,
  makeGooseModSettings, */

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

  cspBypasser,
  showToast,
  confirmDialog,
  moduleStoreAPI,

  changelog: Changelog,
  goosemodChangelog: GoosemodChangelog
};

const init = async function () {
  Object.assign(this, importsToAssign);

  fixLocalStorage();

  let a = 1;
  for (let x of scopeSetterFncs) {
    console.log(a, x);
    x(this);

    a++;
  };

  await this.cspBypasser.init();

  /*for (let p in toAssign) {
    if (toAssign.hasOwnProperty(p)) {
      
    }
  }*/

  this.settings.makeGooseModSettings();

  // this.logger = Logger;

  this.removed = false;

  this.modules = {};
  this.disabledModules = {};

  this.lastVersion = localStorage.getItem('goosemodLastVersion');
  this.version = '4.4.0';
  this.versionHash = '<hash>'; // Hash of built final js file is inserted here via build script

  if (this.lastVersion !== this.version) {
    this.goosemodChangelog.show();
  }

  localStorage.setItem('goosemodLastVersion', this.version);

  this.logger.debug('import.version.goosemod', `${this.version} (${this.versionHash})`);

  if (window.DiscordNative !== undefined) this.logger.debug('import.version.discord', `${DiscordNative.app.getReleaseChannel()} ${DiscordNative.app.getVersion()}`);
  
  if (window.gmUntethered) {
    this.untetheredVersion = window.gmUntethered.slice();
    
    // delete window.gmUntethered;
  }
  
  // this.webpackModules = WebpackModules;
  
  // this.showToast = showToast;
  
  this.showToast(`GooseMod v${this.version} (${this.versionHash.substring(0, 7)})`, {timeout: 1000});
  
  // this.messageEasterEggs = easterEggs;
  
  // this.confirmDialog = confirmDialog;
  
  this.messageEasterEggs.interval = setInterval(this.messageEasterEggs.check, 1000);
  
  /* Object.assign(this, {
    startLoadingScreen,
    stopLoadingScreen,
    updateLoadingScreen
  });
  
  Object.assign(this, {
    removeModuleUI,
    isSettingsOpen,
    closeSettings,
    openSettings,
    openSettingItem,
    reopenSettings,
    injectInSettings,
    checkSettingsOpenInterval
  });
  
  this.cspBypasser = cspBypasser; */
  
  /* Object.assign(this, {
    importModule,
    importModules,
    bindHandlers,
    getModuleFiles,
    importModulesFull
  });
  
  Object.assign(this, {
    saveModuleSettings,
    clearModuleSetting,
    clearSettings,
    loadSavedModuleSetting,
    loadSavedModuleSettings
  });
  
  this.moduleStoreAPI = moduleStoreAPI; */
  
  this.saveInterval = setInterval(this.saveModuleSettings, 3000);
  
  this.remove = () => {
    clearInterval(this.messageEasterEggs.interval);
    clearInterval(this.saveInterval);
    clearInterval(this.checkSettingsOpenInterval);
    
    localStorage.removeItem('goosemodLastVersion');

    this.clearSettings();
    this.moduleStoreAPI.jsCache.purgeCache();
    
    this.removed = true;
    
    for (let p in this.modules) {
      if (this.modules.hasOwnProperty(p) && this.modules[p].remove !== undefined) {
        this.modules[p].remove();
      }
    }
  };
  
  this.startLoadingScreen();
  
  this.updateLoadingScreen('Getting module index from Module Store...');
  
  await this.moduleStoreAPI.updateModules();
  
  this.moduleStoreAPI.updateStoreSetting();
  
  this.initialImport = true;
  
  let toInstallModules = Object.keys(JSON.parse(localStorage.getItem('goosemodModules')) || {});
  let toInstallIsDefault = false;
  
  if (toInstallModules.length === 0) {
    toInstallIsDefault = true;
    toInstallModules = ['hardcodedColorFixer', 'draculaTheme', 'fucklytics', 'visualTweaks', 'wysiwygMessages', 'customSounds', 'devMode', 'twitchEmotes', 'noMessageDeletion'];
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
  
  this.updateLoadingScreen(`Importing default modules from Module Store... (${toInstallIsDefault ? '(Default)' : '(Last Installed)'})`);
  
  for (let m of toInstallModules) {
    this.updateLoadingScreen(`${this.moduleStoreAPI.modules.find((x) => x.filename === m).name} - ${toInstallModules.indexOf(m) + 1}/${toInstallModules.length}`)
    //this.updateLoadingScreen(`Importing default modules from Module Store...<br><br>${this.moduleStoreAPI.modules.find((x) => x.filename === m).name}<br>${toInstallModules.indexOf(m) + 1}/${toInstallModules.length}<br>${toInstallIsDefault ? '(Default)' : '(Last Installed)'}`);
    
    await this.moduleStoreAPI.importModule(m);
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