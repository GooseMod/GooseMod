import sleep from './util/sleep';

import * as Logger from './util/logger';

import WebpackModules from './util/discord/webpackModules';
import fixLocalStorage from './util/discord/fixLocalStorage';

import cspBypasser from './util/discord/cspBypasser';

import showToast from './ui/toast';
import confirmDialog from './ui/modals/confirm';

import { startLoadingScreen, stopLoadingScreen, updateLoadingScreen } from './ui/loading';

import { removeModuleUI, isSettingsOpen, closeSettings, openSettings, openSettingItem, reopenSettings, injectInSettings, checkSettingsOpenInterval } from './ui/settings';

import easterEggs from './ui/easterEggs';

import { importModule, importModules, bindHandlers, getModuleFiles, importModulesFull } from './moduleManager';
import { saveModuleSettings, clearModuleSetting, clearSettings, loadSavedModuleSetting, loadSavedModuleSettings } from './moduleSettingsStore';

import moduleStoreAPI from './moduleStore';


const importsToAssign = {
  startLoadingScreen,
  stopLoadingScreen,
  updateLoadingScreen,

  removeModuleUI,
  isSettingsOpen,
  closeSettings,
  openSettings,
  openSettingItem,
  reopenSettings,
  injectInSettings,
  checkSettingsOpenInterval,

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
  moduleStoreAPI
};

const init = async function () {
  /*for (let p in toAssign) {
    if (toAssign.hasOwnProperty(p)) {
      
    }
  }*/

  Object.assign(globalThis, importsToAssign);

  // globalThis.logger = Logger;

  globalThis.removed = false;

  globalThis.modules = {};
  globalThis.disabledModules = {};

  globalThis.version = '3.1.0';
  globalThis.versionHash = '<hash>'; // hash of built final js file is inserted here via build script

  globalThis.logger.debug('import.version.goosemod', `${globalThis.version} (${globalThis.versionHash})`);

  if (window.DiscordNative !== undefined) globalThis.logger.debug('import.version.discord', `${DiscordNative.app.getReleaseChannel()} ${DiscordNative.app.getVersion()}`);
  
  if (window.gmUntethered) {
    globalThis.untetheredVersion = window.gmUntethered.slice();
    
    // delete window.gmUntethered;
  }
  
  // globalThis.webpackModules = WebpackModules;
  
  fixLocalStorage();
  
  // globalThis.showToast = showToast;
  
  globalThis.showToast(`GooseMod v${globalThis.version} (${globalThis.versionHash.substring(0, 7)})`, {timeout: 1000});
  
  // globalThis.messageEasterEggs = easterEggs;
  
  // globalThis.confirmDialog = confirmDialog;
  
  globalThis.messageEasterEggs.interval = setInterval(globalThis.messageEasterEggs.check, 1000);
  
  /* Object.assign(globalThis, {
    startLoadingScreen,
    stopLoadingScreen,
    updateLoadingScreen
  });
  
  Object.assign(globalThis, {
    removeModuleUI,
    isSettingsOpen,
    closeSettings,
    openSettings,
    openSettingItem,
    reopenSettings,
    injectInSettings,
    checkSettingsOpenInterval
  });
  
  globalThis.cspBypasser = cspBypasser; */
  
  globalThis.cspBypasser.init();
  
  /* Object.assign(globalThis, {
    importModule,
    importModules,
    bindHandlers,
    getModuleFiles,
    importModulesFull
  });
  
  Object.assign(globalThis, {
    saveModuleSettings,
    clearModuleSetting,
    clearSettings,
    loadSavedModuleSetting,
    loadSavedModuleSettings
  });
  
  globalThis.moduleStoreAPI = moduleStoreAPI; */
  
  globalThis.saveInterval = setInterval(globalThis.saveModuleSettings, 3000);
  
  globalThis.remove = () => {
    clearInterval(globalThis.messageEasterEggs.interval);
    clearInterval(globalThis.saveInterval);
    clearInterval(globalThis.injectInSettings);
    
    globalThis.clearSettings();
    globalThis.moduleStoreAPI.jsCache.purgeCache();
    
    globalThis.removed = true;
    
    for (let p in globalThis.modules) {
      if (globalThis.modules.hasOwnProperty(p) && globalThis.modules[p].remove !== undefined) {
        globalThis.modules[p].remove();
      }
    }
  };
  
  globalThis.startLoadingScreen();
  
  globalThis.updateLoadingScreen('Getting module index from Module Store...');
  
  await globalThis.moduleStoreAPI.updateModules();
  
  globalThis.moduleStoreAPI.updateStoreSetting();
  
  globalThis.initialImport = true;
  
  let toInstallModules = Object.keys(JSON.parse(localStorage.getItem('goosemodModules')) || {});
  let toInstallIsDefault = false;
  
  if (toInstallModules.length === 0) {
    toInstallIsDefault = true;
    toInstallModules = ['hardcodedColorFixer', 'draculaTheme', 'fucklytics', 'visualTweaks', 'wysiwygMessages', 'customSounds', 'devMode', 'twitchEmotes', 'noMessageDeletion'];
  }
  
  toInstallModules = toInstallModules.filter((m) => globalThis.moduleStoreAPI.modules.find((x) => x.filename === m) !== undefined);
  
  let themeModule = toInstallModules.find((x) => x.toLowerCase().includes('theme'));
  
  if (themeModule) {
    toInstallModules.unshift(toInstallModules.splice(toInstallModules.indexOf(themeModule), 1)[0]);
  }
  
  let hardcodedColorFixerModule = toInstallModules.find((x) => x === 'hardcodedColorFixer');
  
  if (hardcodedColorFixerModule) {
    toInstallModules.unshift(toInstallModules.splice(toInstallModules.indexOf(hardcodedColorFixerModule), 1)[0]);
  }
  
  globalThis.updateLoadingScreen(`Importing default modules from Module Store... (${toInstallIsDefault ? '(Default)' : '(Last Installed)'})`);
  
  for (let m of toInstallModules) {
    globalThis.updateLoadingScreen(`${globalThis.moduleStoreAPI.modules.find((x) => x.filename === m).name} - ${toInstallModules.indexOf(m) + 1}/${toInstallModules.length}`)
    //globalThis.updateLoadingScreen(`Importing default modules from Module Store...<br><br>${globalThis.moduleStoreAPI.modules.find((x) => x.filename === m).name}<br>${toInstallModules.indexOf(m) + 1}/${toInstallModules.length}<br>${toInstallIsDefault ? '(Default)' : '(Last Installed)'}`);
    
    await globalThis.moduleStoreAPI.importModule(m);
  }
  
  delete globalThis.initialImport;
  
  globalThis.updateLoadingScreen(`Loading saved module settings...`);
  
  await globalThis.loadSavedModuleSettings();
  
  globalThis.stopLoadingScreen();
  
  if (globalThis.isSettingsOpen()) { // If settings are open, reopen to inject new GooseMod options
    globalThis.reopenSettings();
  } else {
    // Only open settings (when not already open) if new user
    if (!localStorage.getItem('goosemodModules')) {
      globalThis.openSettings();
      
      await sleep(200);
      
      globalThis.openSettingItem('Module Store');
    }
  }
};

init();