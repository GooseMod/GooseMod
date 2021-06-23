import sleep from '../../util/sleep';

import * as GMSettings from '../../gmSettings';
export const gmSettings = GMSettings;

import addToHome from './home';
import addToContextMenu from './contextMenu';
import addToSettingsSidebar from './settingsSidebar';

import addBaseItems from './baseItems';

import addCustomCss from './css';

import getItems from './items';
let Items = {};

let goosemodScope = {};

export const setThisScope = async (scope) => {
  goosemodScope = scope;

  Items = getItems();
};


export const removeModuleUI = (field, where) => {
  // let settingItem = goosemodScope.settings.items.find((x) => x[1] === 'Local Modules');

  // settingItem[2].splice(settingItem[2].indexOf(settingItem[2].find((x) => x.subtext === goosemodScope.modules[field].description)), 1);

  const isDisabled = goosemodScope.modules[field] === undefined; // If module is currently disabled
  if (isDisabled) {
    goosemodScope.modules[field] = Object.assign({}, goosemodScope.disabledModules[field]); // Move from disabledModules -> modules
    delete goosemodScope.disabledModules[field];
  }

  goosemodScope.moduleStoreAPI.moduleRemoved(goosemodScope.modules[field]);

  if (!isDisabled) goosemodScope.modules[field].goosemodHandlers.onRemove();

  delete goosemodScope.modules[field];

  goosemodScope.moduleSettingsStore.clearModuleSetting(field);

  // goosemodScope.settings.createFromItems();

  if (where) goosemodScope.settings.openSettingItem(where);
};

export const isSettingsOpen = () => {
  return document.querySelector('div[aria-label="USER_SETTINGS"] .closeButton-1tv5uR') !== null;
};

export const closeSettings = () => {
  let closeEl = document.querySelector('div[aria-label="USER_SETTINGS"] .closeButton-1tv5uR');
  
  if (closeEl === null) return false;
  
  closeEl.click(); // Close settings via clicking the close settings button
};

export const openSettings = () => {
  document.querySelector('.flex-1xMQg5.flex-1O1GKY.horizontal-1ae9ci.horizontal-2EEEnY.flex-1O1GKY.directionRow-3v3tfG.justifyStart-2NDFzi.alignStretch-DpGPf3.noWrap-3jynv6 > [type="button"]:last-child').click();
};

export const openSettingItem = (name) => {
  try {
    const children = [...(document.querySelector('div[aria-label="USER_SETTINGS"]').querySelector('nav > div')).children];

    children[1].click(); // To refresh / regenerate

    setTimeout(() => children.find((x) => x.textContent === name).click(), 5);

    return true;
  } catch (e) {
    return false;
  }
};

export const reopenSettings = async () => {
  goosemodScope.settings.closeSettings();

  await sleep(500);

  goosemodScope.settings.openSettings();

  await sleep(100);
};

export let items = [];

export const createItem = (panelName, content, clickHandler, danger = false) => {
  goosemodScope.settings.items.push(['item', panelName, content, clickHandler, danger]);
};

export const removeItem = (setting) => {
  const ind = goosemodScope.settings.items.indexOf(goosemodScope.settings.items.find((x) => x[1] === setting));

  // Trying to remove non-existant item
  if (ind === -1) return false;

  goosemodScope.settings.items.splice(ind, 1);
};

export const createHeading = (headingName) => {
  goosemodScope.settings.items.push(['heading', headingName]);
};

export const createSeparator = () => {
  goosemodScope.settings.items.push(['separator']);
};

export const _createItem = (name, content, container = true) => {
  const { React } = goosemodScope.webpackModules.common;

  const FormSection = goosemodScope.webpackModules.findByDisplayName('FormSection');
  const FormTitle = goosemodScope.webpackModules.findByDisplayName('FormTitle');

  const makeContent = () => content.slice(1).map((x, i) => {
    if (x.type.includes('danger-button')) {
      x.type = x.type.replace('danger-', '');
      x.danger = true;
    }

    const component = Items[x.type];

    if (!component) return React.createElement('div');

    return React.createElement(component, {
      i,
      ...x,
      itemName: name
    });
  });

  return container ? React.createElement(FormSection, { },
    React.createElement(FormTitle, { tag: 'h1' }, name),

    makeContent()
  ) : React.createElement('div', { },
    makeContent()
  );
};

export const makeGooseModSettings = () => {
  goosemodScope.settingsUninjects = [];

  addBaseItems(goosemodScope, gmSettings);

  addToSettingsSidebar(goosemodScope, gmSettings);
  addToContextMenu(goosemodScope, gmSettings.get().home);
  if (gmSettings.get().home) addToHome(goosemodScope);

  addCustomCss();

  loadColorPicker();
};

const loadColorPicker = () => { // Force load ColorPicker as it's dynamically loaded
  const { findInReactTree } = goosemodScope.reactUtils;

  if (!goosemodScope.webpackModules.findByDisplayName('ColorPicker')) {
    const GuildFolderSettingsModal = goosemodScope.webpackModules.findByDisplayName('GuildFolderSettingsModal');
    const instance = GuildFolderSettingsModal.prototype.render.call({ props: {}, state: {}});
  
    findInReactTree(instance.props.children, (x) => x.props?.colors).type().props.children.type._ctor();
  }
};