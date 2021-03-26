import sleep from '../util/sleep';
import * as GoosemodChangelog from './goosemodChangelog';

let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
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

  goosemodScope.settings.openSettingItem(where);
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
    const children = [...settingsSidebarEl.children];

    children[1].click(); // To refresh / regenerate
    children.find((x) => x.textContent === name).click();

    return true;
  } catch (e) {
    return false;
  }
};

export const reopenSettings = async () => {
  goosemodScope.settings.closeSettings();

  await sleep(1000);

  goosemodScope.settings.openSettings();

  await sleep(200);

  goosemodScope.settings.openSettingItem('Module Store');
};

// Settings UI stuff

/*let settingsButtonEl;

(async function() {
  settingsButtonEl = document.querySelector('button[aria-label="User Settings"]');

  while (!settingsButtonEl) {
    goosemodScope.showToast('Failed to get settings button, retrying');
    settingsButtonEl = document.querySelector('button[aria-label="User Settings"]');

    await sleep(1000);
  }

  settingsButtonEl.addEventListener('click', injectInSettings);
})();*/

let settingsLayerEl, settingsSidebarEl;

//const settings = {
export let items = [];

export const createItem = (panelName, content, clickHandler, danger = false) => {
  goosemodScope.settings.items.push(['item', panelName, content, clickHandler, danger]);
};

export const removeItem = (setting) => {
  goosemodScope.settings.items.splice(goosemodScope.settings.items.indexOf(goosemodScope.settings.items.find((x) => x[1] === setting)), 1);
};

export const createHeading = (headingName) => {
  goosemodScope.settings.items.push(['heading', headingName]);
};

export const createSeparator = () => {
  goosemodScope.settings.items.push(['separator']);
};

/*export const createFromItems = () => {
  settingsSidebarGooseModContainer.innerHTML = '';

  for (let i of goosemodScope.settings.items) {
    switch (i[0]) {
      case 'item':
        goosemodScope.settings._createItem(i[1], i[2], i[3], i[4]);
        break;
      case 'heading':
        goosemodScope.settings._createHeading(i[1]);
        break;
      case 'separator':
        goosemodScope.settings._createSeparator();
        break;
    }
  }
};*/

export const _createItem = (panelName, content) => {
    let parentEl = document.createElement('div');

    let headerEl = document.createElement('h2');
    headerEl.textContent = `${panelName} ${content[0]}`;

    headerEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'h2-2gWE-o', 'title-3sZWYQ', 'defaultColor-1_ajX0', 'defaultMarginh2-2LTaUL');

    parentEl.appendChild(headerEl);

    let contentEl = document.createElement('div');
    contentEl.className = 'children-rWhLdy';

    parentEl.appendChild(contentEl);

    let specialContainerEl, cardContainerEl;

    if (panelName === goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins || panelName === goosemodScope.i18n.goosemodStrings.settings.itemNames.themes) {
      specialContainerEl = document.createElement('div');

      specialContainerEl.style.display = 'flex';
      specialContainerEl.style.flexDirection = 'row';
      specialContainerEl.style.flexWrap = 'wrap';

      cardContainerEl = document.createElement('div');

      cardContainerEl.style.display = 'grid';

      cardContainerEl.style.gridTemplateColumns = 'repeat(auto-fill, 330px)';
      cardContainerEl.style.gridTemplateRows = 'repeat(auto-fill, 190px)';

      cardContainerEl.style.width = 'calc(100% - 250px)';
      cardContainerEl.style.justifyContent = 'center';

      /*cardContainerEl.style.columnGap = '10px';
      cardContainerEl.style.rowGap = '10px';*/

      document.querySelector('.sidebarRegion-VFTUkN').style.transition = '0.5s max-width';
  
      document.querySelector('.contentColumnDefault-1VQkGM').style.transition = '0.5s max-width';
    }

    let i = 0;
    for (let e of content.slice(1)) {
      let el;

      switch (e.type) {
        case 'divider': {
          el = document.createElement('div');

          el.style.width = '100%';

          let dividerEl = document.createElement('div');
          dividerEl.style.marginTop = '25px';

          dividerEl.classList.add('divider-3573oO', 'dividerDefault-3rvLe-');

          el.appendChild(dividerEl);

          if (e.text) {
            let textEl = document.createElement('div');
            textEl.classList.add('titleDefault-a8-ZSr', 'title-31JmR4');

            textEl.style.position = 'relative';
            textEl.style.top = '-14px';
            textEl.style.left = 'calc(50% - 7.5%)';
            textEl.style.width = '15%';

            textEl.style.textAlign = 'center';
            textEl.style.fontSize = '14px';

            textEl.style.backgroundColor = 'var(--background-tertiary)';
            textEl.style.padding = '2px';
            textEl.style.borderRadius = '8px';

            e.text(contentEl).then((x) => {
              textEl.innerText = x;
            });

            el.appendChild(textEl);
          }

          break;
        }

        case 'header':
          el = document.createElement('h2');

          if (i !== 0) {
            el.classList.add('marginTop20-3TxNs6');
          }

          el.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'h5-18_1nd', 'title-3sZWYQ', 'marginBottom8-AtZOdT');

          el.textContent = e.text;
          break;

        case 'toggle': {
          el = document.createElement('div');

          el.classList.add('marginBottom20-32qID7');

          let txtEl = document.createElement('span');
          txtEl.classList.add('titleDefault-a8-ZSr', 'title-31JmR4');

          txtEl.style.float = 'left';

          txtEl.innerHTML = e.text;

          let checked = e.isToggled();

          let toggleEl = document.createElement('div');
          toggleEl.className = 'control-2BBjec';
          
          let offHTML = '<div class="container-3auIfb" tabindex="-1" style="opacity: 1; background-color: rgb(114, 118, 125);"><svg class="slider-TkfMQL" viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" style="left: -3px;"><rect fill="white" x="4" y="0" height="20" width="20" rx="10"></rect><svg viewBox="0 0 20 20" fill="none"><path fill="rgba(114, 118, 125, 1)" d="M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z"></path><path fill="rgba(114, 118, 125, 1)" d="M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z"></path></svg></svg><input id="uid_328" type="checkbox" class="input-rwLH4i" tabindex="0"></div>';
          let onHTML = '<div class="container-3auIfb" tabindex="-1" style="opacity: 1; background-color: rgb(67, 181, 129);"><svg class="slider-TkfMQL" viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" style="left: 12px;"><rect fill="white" x="4" y="0" height="20" width="20" rx="10"></rect><svg viewBox="0 0 20 20" fill="none"><path fill="rgba(67, 181, 129, 1)" d="M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z"></path><path fill="rgba(67, 181, 129, 1)" d="M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z"></path></svg></svg><input id="uid_328" type="checkbox" class="input-rwLH4i" tabindex="0"></div>';

          let fn = () => {
            checked = !checked;

            if (checked) {
              toggleEl.innerHTML = onHTML;
            } else {
              toggleEl.innerHTML = offHTML;
            }

            e.onToggle(checked, el);
          };

          toggleEl.onclick = fn;
          txtEl.onclick = fn;

          el.appendChild(txtEl);
          el.appendChild(toggleEl);

          toggleEl.innerHTML = checked ? onHTML : offHTML;

          toggleEl.style.float = 'right';

          if (e.subtext) {
            let subtextEl = document.createElement('div');

            subtextEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'description-3_Ncsb', 'formText-3fs7AJ', 'note-1V3kyJ', 'modeDefault-3a2Ph1');

            subtextEl.textContent = e.subtext;

            subtextEl.style.clear = 'both';

            el.appendChild(subtextEl);
          }

          let dividerEl = document.createElement('div');

          dividerEl.classList.add('divider-3573oO', 'dividerDefault-3rvLe-');
          dividerEl.style.marginTop = e.subtext ? '20px' : '45px';

          el.appendChild(dividerEl);

          break;
        }

          case 'text':
            el = document.createElement('div');

            el.classList.add('marginBottom20-32qID7');

            let textEl = document.createElement('span');
            textEl.classList.add('titleDefault-a8-ZSr', 'title-31JmR4');

            textEl.style.float = 'left';

            textEl.innerHTML = e.text;

            el.appendChild(textEl);

            if (e.subtext) {
              let subtextEl = document.createElement('div');

              subtextEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'description-3_Ncsb', 'formText-3fs7AJ', 'note-1V3kyJ', 'modeDefault-3a2Ph1');

              subtextEl.innerHTML = e.subtext;

              subtextEl.style.clear = 'both';

              el.appendChild(subtextEl);
            }

            let dividerEl_ = document.createElement('div');

            dividerEl_.classList.add('divider-3573oO', 'dividerDefault-3rvLe-');
            dividerEl_.style.marginTop = e.subtext ? '20px' : '45px';

            el.appendChild(dividerEl_);

          break;

        case 'text-and-danger-button':
          el = document.createElement('div');

          el.classList.add('marginBottom20-32qID7');

          let txtEl2 = document.createElement('span');
          txtEl2.classList.add('titleDefault-a8-ZSr', 'title-31JmR4');

          txtEl2.style.float = 'left';

          txtEl2.innerHTML = e.text;

          let buttonEl = document.createElement('div');
          buttonEl.classList.add('button-38aScr', 'lookOutlined-3sRXeN', 'colorRed-1TFJan', 'sizeSmall-2cSMqn', 'grow-q77ONN');

          buttonEl.onclick = () => {
            e.onclick(buttonEl);
          };

          buttonEl.style.cursor = 'pointer';

          buttonEl.style.float = 'right';

          let contentsEl2 = document.createElement('div');

          contentsEl2.classList.add('contents-18-Yxp');

          contentsEl2.textContent = e.buttonText;

          buttonEl.appendChild(contentsEl2);

          el.appendChild(txtEl2);
          el.appendChild(buttonEl);

          if (e.subtext) {
            let subtextEl = document.createElement('div');

            subtextEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'description-3_Ncsb', 'formText-3fs7AJ', 'note-1V3kyJ', 'modeDefault-3a2Ph1');

            subtextEl.textContent = e.subtext;

            subtextEl.style.clear = 'both';

            el.appendChild(subtextEl);
          }

          let dividerEl2 = document.createElement('div');

          dividerEl2.classList.add('divider-3573oO', 'dividerDefault-3rvLe-');
          dividerEl2.style.marginTop = e.subtext ? '20px' : '45px';

          el.appendChild(dividerEl2);

          break;

          case 'text-and-button':
            el = document.createElement('div');

            el.classList.add('marginBottom20-32qID7');

            let txtEl3 = document.createElement('span');
            txtEl3.classList.add('titleDefault-a8-ZSr', 'title-31JmR4');

            txtEl3.style.float = 'left';

            txtEl3.innerHTML = e.text;

            let buttonEl2 = document.createElement('div');
            buttonEl2.classList.add('button-38aScr', 'lookFilled-1Gx00P', 'colorBrand-3pXr91', 'sizeSmall-2cSMqn', 'grow-q77ONN');

            buttonEl2.onclick = () => {
              e.onclick(buttonEl2);
            };

            buttonEl2.style.cursor = 'pointer';

            buttonEl2.style.float = 'right';

            let contentsEl3 = document.createElement('div');

            contentsEl3.classList.add('contents-18-Yxp');

            contentsEl3.textContent = e.buttonText;

            buttonEl2.appendChild(contentsEl3);

            el.appendChild(txtEl3);
            el.appendChild(buttonEl2);

            if (e.subtext) {
              let subtextEl2 = document.createElement('div');

              subtextEl2.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'description-3_Ncsb', 'formText-3fs7AJ', 'note-1V3kyJ', 'modeDefault-3a2Ph1');

              subtextEl2.textContent = e.subtext;

              subtextEl2.style.clear = 'both';

              el.appendChild(subtextEl2);
            }

            let dividerEl3 = document.createElement('div');

            dividerEl3.classList.add('divider-3573oO', 'dividerDefault-3rvLe-');
            dividerEl3.style.marginTop = e.subtext ? '20px' : '45px';

            el.appendChild(dividerEl3);

            break;

          case 'text-and-color': {
            el = document.createElement('div');

            el.classList.add('marginBottom20-32qID7');

            let txtEl = document.createElement('span');
            txtEl.classList.add('titleDefault-a8-ZSr', 'title-31JmR4');

            txtEl.style.float = 'left';

            txtEl.innerHTML = e.text;

            let colorEl = document.createElement('input');
            colorEl.type = 'color';

            colorEl.style.width = '50px';
            colorEl.style.height = '30px';

            colorEl.style.display = 'block';

            colorEl.classList.add('colorPickerSwatch-5GX3Ve', 'custom-2SJn4n', 'noColor-1pdBDm');

            if (e.initialValue) colorEl.value = e.initialValue();
            colorEl.oninput = () => {
              e.oninput(colorEl.value);
              //e.onclick(buttonEl2);
            };

            colorEl.style.cursor = 'pointer';

            colorEl.style.float = 'right';

            el.appendChild(txtEl);
            el.appendChild(colorEl);

            if (e.subtext) {
              let subtextEl = document.createElement('div');

              subtextEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'description-3_Ncsb', 'formText-3fs7AJ', 'note-1V3kyJ', 'modeDefault-3a2Ph1');

              subtextEl.textContent = e.subtext;

              subtextEl.style.clear = 'both';

              el.appendChild(subtextEl);
            }

            let dividerEl = document.createElement('div');

            dividerEl.classList.add('divider-3573oO', 'dividerDefault-3rvLe-');
            dividerEl.style.marginTop = e.subtext ? '20px' : '45px';

            el.appendChild(dividerEl);

            break;
        }

        case 'button':
          el = document.createElement('button');

          el.classList.add('button-38aScr', 'lookFilled-1Gx00P', 'colorBrand-3pXr91', 'sizeSmall-2cSMqn', 'grow-q77ONN');

          if (e.width) {
            el.style.width = `${e.width}px`;
          }

          let contentsEl = document.createElement('div');

          contentsEl.classList.add('contents-18-Yxp');

          contentsEl.textContent = e.text;

          el.appendChild(contentsEl);

          el.onclick = e.onclick;

          break;

        case 'toggle-text-button': {
          el = document.createElement('div');

          el.classList.add('marginBottom20-32qID7');

          let checked = e.isToggled();

          let toggleEl = document.createElement('div');
          toggleEl.className = 'control-2BBjec';
          
          let offHTML = '<div class="container-3auIfb" tabindex="-1" style="opacity: 1; background-color: rgb(114, 118, 125);"><svg class="slider-TkfMQL" viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" style="left: -3px;"><rect fill="white" x="4" y="0" height="20" width="20" rx="10"></rect><svg viewBox="0 0 20 20" fill="none"><path fill="rgba(114, 118, 125, 1)" d="M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z"></path><path fill="rgba(114, 118, 125, 1)" d="M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z"></path></svg></svg><input id="uid_328" type="checkbox" class="input-rwLH4i" tabindex="0"></div>';
          let onHTML = '<div class="container-3auIfb" tabindex="-1" style="opacity: 1; background-color: rgb(67, 181, 129);"><svg class="slider-TkfMQL" viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" style="left: 12px;"><rect fill="white" x="4" y="0" height="20" width="20" rx="10"></rect><svg viewBox="0 0 20 20" fill="none"><path fill="rgba(67, 181, 129, 1)" d="M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z"></path><path fill="rgba(67, 181, 129, 1)" d="M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z"></path></svg></svg><input id="uid_328" type="checkbox" class="input-rwLH4i" tabindex="0"></div>';

          toggleEl.innerHTML = checked ? onHTML : offHTML;

          let fn = () => {
            checked = !checked;

            if (checked) {
              toggleEl.innerHTML = onHTML;
            } else {
              toggleEl.innerHTML = offHTML;
            }

            e.onToggle(checked, el);
          };

          toggleEl.onclick = fn;

          toggleEl.style.float = 'left';
          toggleEl.style.marginRight = '8px';

          el.appendChild(toggleEl);

          let txtEl = document.createElement('span');

          txtEl.onclick = fn;

          txtEl.classList.add('titleDefault-a8-ZSr', 'title-31JmR4');

          txtEl.style.float = 'left';

          txtEl.innerHTML = e.text;

          let buttonEl = document.createElement('div');
          buttonEl.classList.add('button-38aScr', 'lookFilled-1Gx00P', 'colorBrand-3pXr91', 'sizeSmall-2cSMqn', 'grow-q77ONN');

          buttonEl.onclick = () => {
            e.onclick(buttonEl);
          };

          buttonEl.style.cursor = 'pointer';

          buttonEl.style.float = 'right';

          let contentsEl = document.createElement('div');

          contentsEl.classList.add('contents-18-Yxp');

          contentsEl.textContent = e.buttonText;

          buttonEl.appendChild(contentsEl);

          el.appendChild(txtEl);
          el.appendChild(buttonEl);

          if (e.subtext) {
            let subtextEl = document.createElement('div');

            subtextEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'description-3_Ncsb', 'formText-3fs7AJ', 'note-1V3kyJ', 'modeDefault-3a2Ph1');

            subtextEl.textContent = e.subtext;

            subtextEl.style.clear = 'both';

            el.appendChild(subtextEl);
          }

          let dividerEl = document.createElement('div');

          dividerEl.classList.add('divider-3573oO', 'dividerDefault-3rvLe-');
          dividerEl.style.marginTop = e.subtext ? '20px' : '45px';

          el.appendChild(dividerEl);

          break;
        }

        case 'toggle-text-danger-button': {
          el = document.createElement('div');

          el.classList.add('marginBottom20-32qID7');

          let checked = e.isToggled();

          let toggleEl = document.createElement('div');
          toggleEl.className = 'control-2BBjec';
          
          let offHTML = '<div class="container-3auIfb" tabindex="-1" style="opacity: 1; background-color: rgb(114, 118, 125);"><svg class="slider-TkfMQL" viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" style="left: -3px;"><rect fill="white" x="4" y="0" height="20" width="20" rx="10"></rect><svg viewBox="0 0 20 20" fill="none"><path fill="rgba(114, 118, 125, 1)" d="M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z"></path><path fill="rgba(114, 118, 125, 1)" d="M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z"></path></svg></svg><input id="uid_328" type="checkbox" class="input-rwLH4i" tabindex="0"></div>';
          let onHTML = '<div class="container-3auIfb" tabindex="-1" style="opacity: 1; background-color: rgb(67, 181, 129);"><svg class="slider-TkfMQL" viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" style="left: 12px;"><rect fill="white" x="4" y="0" height="20" width="20" rx="10"></rect><svg viewBox="0 0 20 20" fill="none"><path fill="rgba(67, 181, 129, 1)" d="M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z"></path><path fill="rgba(67, 181, 129, 1)" d="M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z"></path></svg></svg><input id="uid_328" type="checkbox" class="input-rwLH4i" tabindex="0"></div>';

          toggleEl.innerHTML = checked ? onHTML : offHTML;

          let fn = () => {
            checked = !checked;

            if (checked) {
              toggleEl.innerHTML = onHTML;
            } else {
              toggleEl.innerHTML = offHTML;
            }

            e.onToggle(checked, el);
          };

          toggleEl.onclick = fn;

          toggleEl.style.float = 'left';
          toggleEl.style.marginRight = '8px';

          el.appendChild(toggleEl);

          let txtEl = document.createElement('span');

          txtEl.onclick = fn;

          txtEl.classList.add('titleDefault-a8-ZSr', 'title-31JmR4');

          txtEl.style.float = 'left';

          txtEl.innerHTML = e.text;

          let buttonEl = document.createElement('div');
          buttonEl.classList.add('button-38aScr', 'lookOutlined-3sRXeN', 'colorRed-1TFJan', 'sizeSmall-2cSMqn', 'grow-q77ONN');

          buttonEl.onclick = () => {
            e.onclick(buttonEl);
          };

          buttonEl.style.cursor = 'pointer';

          buttonEl.style.float = 'right';

          let contentsEl = document.createElement('div');

          contentsEl.classList.add('contents-18-Yxp');

          contentsEl.textContent = e.buttonText;

          buttonEl.appendChild(contentsEl);

          el.appendChild(txtEl);
          el.appendChild(buttonEl);

          if (e.subtext) {
            let subtextEl = document.createElement('div');

            subtextEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'description-3_Ncsb', 'formText-3fs7AJ', 'note-1V3kyJ', 'modeDefault-3a2Ph1');

            subtextEl.textContent = e.subtext;

            subtextEl.style.clear = 'both';

            el.appendChild(subtextEl);
          }

          let dividerEl = document.createElement('div');

          dividerEl.classList.add('divider-3573oO', 'dividerDefault-3rvLe-');
          dividerEl.style.marginTop = e.subtext ? '20px' : '45px';

          el.appendChild(dividerEl);

          break;
        }

        case 'card': {
          el = document.createElement('div');

          if (e.tags) e.tags.forEach((x) => el.classList.add(x.replace(/ /g, '|')));

          //if (e.class) el.classList.add(e.class);

          el.style.backgroundColor = 'var(--background-secondary)';

          el.style.borderRadius = '8px';

          el.style.padding = '12px';
          el.style.margin = '10px';

          el.style.width = '310px';
          el.style.height = '170px';

          el.style.position = 'relative';

          let checked = e.isToggled();

          let toggleEl = document.createElement('div');
          toggleEl.classList.add('control-2BBjec');
          
          let offHTML = '<div class="container-3auIfb" tabindex="-1" style="opacity: 1; background-color: rgb(114, 118, 125);"><svg class="slider-TkfMQL" viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" style="left: -3px;"><rect fill="white" x="4" y="0" height="20" width="20" rx="10"></rect><svg viewBox="0 0 20 20" fill="none"><path fill="rgba(114, 118, 125, 1)" d="M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z"></path><path fill="rgba(114, 118, 125, 1)" d="M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z"></path></svg></svg><input id="uid_328" type="checkbox" class="input-rwLH4i" tabindex="0"></div>';
          let onHTML = '<div class="container-3auIfb" tabindex="-1" style="opacity: 1; background-color: rgb(67, 181, 129);"><svg class="slider-TkfMQL" viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" style="left: 12px;"><rect fill="white" x="4" y="0" height="20" width="20" rx="10"></rect><svg viewBox="0 0 20 20" fill="none"><path fill="rgba(67, 181, 129, 1)" d="M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z"></path><path fill="rgba(67, 181, 129, 1)" d="M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z"></path></svg></svg><input id="uid_328" type="checkbox" class="input-rwLH4i" tabindex="0"></div>';

          toggleEl.innerHTML = checked ? onHTML : offHTML;

          let fn = () => {
            checked = !checked;

            if (checked) {
              toggleEl.innerHTML = onHTML;
            } else {
              toggleEl.innerHTML = offHTML;
            }

            e.onToggle(checked, el);
          };

          toggleEl.onclick = fn;

          toggleEl.style.marginTop = '4px';

          toggleEl.style.position = 'absolute';
          toggleEl.style.right = '-10px';

          let txtEl = document.createElement('span');
          
          //if (!e.showToggle) {
            txtEl.style.cursor = 'auto';
          /*} else {
            txtEl.onclick = fn;
          }*/

          txtEl.classList.add('titleDefault-a8-ZSr', 'title-31JmR4');

          txtEl.style.overflow = 'hidden';
          txtEl.style.display = '-webkit-box';
          txtEl.style.webkitLineClamp = '1';
          txtEl.style.webkitBoxOrient = 'vertical';

          txtEl.innerHTML = e.text;

          txtEl.style.width = '85%';

          let buttonEl = document.createElement('div');
          buttonEl.classList.add('button-38aScr', e.buttonType === 'danger' ? 'lookOutlined-3sRXeN' : 'lookFilled-1Gx00P', e.buttonType === 'danger' ? 'colorRed-1TFJan' : 'colorBrand-3pXr91', 'sizeSmall-2cSMqn', 'grow-q77ONN');

          buttonEl.onclick = () => {
            e.onclick(buttonEl);
          };

          buttonEl.style.display = 'inline-flex';

          buttonEl.style.cursor = 'pointer';

          buttonEl.style.width = '90px';

          let contentsEl = document.createElement('div');

          contentsEl.classList.add('contents-18-Yxp');

          contentsEl.textContent = e.buttonText;

          buttonEl.appendChild(contentsEl);

          el.appendChild(txtEl);

          if (e.subtext) {
            let subtextEl = document.createElement('div');

            subtextEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'description-3_Ncsb', 'formText-3fs7AJ', 'modeDefault-3a2Ph1');

            subtextEl.style.width = '85%';
            subtextEl.style.marginTop = '5px';

            subtextEl.style.overflow = 'hidden';
            subtextEl.style.display = '-webkit-box';
            subtextEl.style.webkitLineClamp = '3';
            subtextEl.style.webkitBoxOrient = 'vertical';

            subtextEl.onclick = () => {
              const { React } = goosemodScope.webpackModules.common;

              const moduleName = txtEl.childNodes[0].textContent;

              const authorsEl = txtEl.cloneNode(true);
              authorsEl.childNodes[0].remove();
              authorsEl.children[0].textContent = authorsEl.children[0].textContent[0].toUpperCase() + authorsEl.children[0].textContent.substring(1);

              const betterDescEl = subtextEl.cloneNode(true);
              betterDescEl.className = 'titleDefault-a8-ZSr title-31JmR4';
              betterDescEl.style.pointer = 'auto';
              betterDescEl.style.width = '';
              betterDescEl.style.webkitLineClamp = '5';

              betterDescEl.style.cursor = 'default';
              betterDescEl.onclick = undefined;

              betterDescEl.style.marginBottom = '10px';

              const extraInfoEl = bottomRightContainerEl.cloneNode(true);
              extraInfoEl.style.marginLeft = '';
              extraInfoEl.style.flexDirection = 'row';

              extraInfoEl.style.position = '';
              extraInfoEl.style.top = '';
              extraInfoEl.style.right = '';

              extraInfoEl.style.marginBottom = '16px';
              extraInfoEl.style.marginTop = '-5px';

              [...extraInfoEl.children].forEach((x) => { x.style.marginRight = '20px' });

              extraInfoEl.children[0].style.display = 'flex';
              extraInfoEl.children[0].style.alignItems = 'flex-end';

              extraInfoEl.children[0].style.position = '';
              extraInfoEl.children[0].style.top = '';

              extraInfoEl.children[1].style.marginBottom = '10px';

              extraInfoEl.children[2].style.marginTop = '4px';

              const imagesEl = document.createElement('div');

              if (e.images && e.images.length > 0) {
                // imagesEl.style.overflow = 'hidden';

                extraInfoEl.style.marginBottom = '25px';

                const controlLeftEl = document.createElement('a');
                controlLeftEl.textContent = '❮';

                const controlRightEl = document.createElement('a');
                controlRightEl.textContent = '❯';

                for (const c of [controlLeftEl, controlRightEl]) {
                  c.style.color = 'white';
                  c.style.fontWeight = 'bold';
                  c.style.fontSize = '20px';
                  c.style.borderRadius = '0 3px 3px 0';
                  c.style.userSelect = 'none';
                  c.style.padding = '14px';
                  c.style.cursor = 'pointer';
                  c.style.position = 'absolute';
                  c.style.width = 'auto';

                  c.style.backgroundColor = 'rgba(0, 0, 0, .3)';

                  c.style.top = '50%';
                  c.style.transform = 'translateY(-50%)';
                }
                
                controlLeftEl.style.left = '0';

                controlRightEl.style.right = '0';
                controlRightEl.style.borderRadius = '3px 0 0 3px';

                /*const updateShown = () => {
                  imgEls.forEach((x) => { x.style.display = 'none'; });

                  imgEls[currentImage].style.display = 'block';
                };*/

                let currentImage = 0;

                controlLeftEl.onclick = () => { // https://www.w3schools.com/howto/howto_js_slideshow_gallery.asp
                  const oldCurrent = currentImage;
                  imgEls[oldCurrent].style.marginLeft = '120%';

                  imgEls[oldCurrent].style.position = 'absolute';
                  imgEls[oldCurrent].style.top = '0';
                  imgEls[oldCurrent].style.left = '0';

                  currentImage--;

                  if (currentImage < 0) currentImage = e.images.length - 1;

                  imgEls[currentImage].style.transition = '';
                  imgEls[currentImage].style.marginLeft = '-120%';
                  
                  setTimeout(() => {
                    imgEls[currentImage].style.transition = 'all 1s';
                    imgEls[currentImage].style.marginLeft = '';
                  }, 10);

                  imgEls[currentImage].style.display = 'block';

                  imgEls[currentImage].style.position = '';
                };

                controlRightEl.onclick = () => {
                  const oldCurrent = currentImage;
                  imgEls[oldCurrent].style.marginLeft = '-120%';
                  // setTimeout(() => { imgEls[oldCurrent].style.display = 'none'; }, 1000);

                  imgEls[oldCurrent].style.position = 'absolute';
                  imgEls[oldCurrent].style.top = '0';
                  imgEls[oldCurrent].style.left = '0';

                  currentImage++;

                  if (currentImage >= e.images.length) currentImage = 0;

                  imgEls[currentImage].style.transition = '';
                  imgEls[currentImage].style.marginLeft = '120%';
                  
                  setTimeout(() => {
                    imgEls[currentImage].style.transition = 'all 1s';
                    imgEls[currentImage].style.marginLeft = '';
                  }, 10);

                  imgEls[currentImage].style.display = 'block';

                  imgEls[currentImage].style.position = '';
                };

                const imgEls = [];

                let imgInd = 0;
                for (const url of e.images) {
                  imagesEl.style.position = 'relative';

                  const currentEl = document.createElement('img');
                  currentEl.src = url;
                
                  currentEl.style.width = '100%';
                  currentEl.style.height = '300px';
                  currentEl.style.objectFit = 'contain';
                  currentEl.style.backgroundColor = 'var(--background-secondary)';
                  currentEl.style.boxShadow = 'var(--elevation-medium)';

                  currentEl.style.borderRadius = '8px';

                  currentEl.style.transition = 'all 1s';

                  // currentEl.style.display = 'inline-block';

                  if (imgInd !== currentImage) currentEl.style.display = 'none';

                  imgEls.push(currentEl);

                  imagesEl.appendChild(currentEl);

                  imgInd++;
                }

                imagesEl.appendChild(controlLeftEl);
                imagesEl.appendChild(controlRightEl);

                imagesEl.style.marginBottom = '16px';
              }

              const ModalStuff = goosemodScope.webpackModules.findByProps('ModalRoot');
              const FormStuff = goosemodScope.webpackModules.findByProps('FormTitle');

              class RawDOMContainer extends React.Component {
                constructor(props) {
                  super(props);
                }

                render() {
                  return React.createElement("div", {
                    ref: (ref) => ref?.appendChild(this.props.dom)
                  });
                }
              }

              goosemodScope.webpackModules.findByProps("openModal").openModal((e) => {
                return React.createElement(ModalStuff.ModalRoot, {
                    transitionState: e.transitionState
                  }, 
                  React.createElement(ModalStuff.ModalHeader, {},
                    React.createElement(FormStuff.FormTitle, { tag: 'h4'},
                      moduleName,
                      React.createElement(RawDOMContainer, {
                        dom: authorsEl
                      })
                    ),
                    React.createElement('FlexChild', {
                        basis: 'auto',
                        grow: 0,
                        shrink: 1,
                        wrap: false
                      },
                      React.createElement(ModalStuff.ModalCloseButton, {
                        onClick: e.onClose
                        })
                    )
                  ),
          
                  React.createElement(ModalStuff.ModalContent, {},
                    React.createElement(RawDOMContainer, {
                      dom: betterDescEl
                    }),
                    React.createElement(RawDOMContainer, {
                      dom: extraInfoEl
                    }),
                    React.createElement(RawDOMContainer, {
                      dom: imagesEl
                    })
                  )
                );
              });
            };

            subtextEl.textContent = e.subtext;

            subtextEl.style.clear = 'both';

            el.appendChild(subtextEl);
          };

          let bottomContainerEl = document.createElement('div');

          bottomContainerEl.style.position = 'absolute';
          bottomContainerEl.style.bottom = '12px';
          bottomContainerEl.style.width = 'calc(100% - 32px)';

          bottomContainerEl.style.display = 'flex';
          bottomContainerEl.style.gap = '5px';

          bottomContainerEl.appendChild(buttonEl);

          if (e.showToggle) bottomContainerEl.appendChild(toggleEl);

          let bottomRightContainerEl = document.createElement('div');

          bottomRightContainerEl.style.display = 'flex';
          bottomRightContainerEl.style.alignItems = 'center';
          bottomRightContainerEl.style.flexDirection = 'column';

          bottomRightContainerEl.style.order = '2';
          bottomRightContainerEl.style.marginLeft = 'auto';

          bottomRightContainerEl.style.position = 'absolute';
          bottomRightContainerEl.style.top = '12px';
          bottomRightContainerEl.style.right = '12px';

          // bottomContainerEl.appendChild(bottomRightContainerEl);
          el.appendChild(bottomRightContainerEl);

          if (e.github) {
            const repoEl = document.createElement('a');
            repoEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path style="fill: currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
            repoEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'description-3_Ncsb', 'formText-3fs7AJ', 'modeDefault-3a2Ph1');

            repoEl.href = `https://github.com/${e.github.repo}`;
            repoEl.target = '_blank';

            repoEl.style.position = 'relative';
            repoEl.style.top = '4px';

            repoEl.style.cursor = 'pointer';

            repoEl.onmouseover = function () { this.style.color = '#eee'; };
            repoEl.onmouseleave = function () { this.style.color = ''; };

            const starsEl = document.createElement('div');

            starsEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'description-3_Ncsb', 'formText-3fs7AJ', 'modeDefault-3a2Ph1');

            const starsIconEl = document.createElement('span');
            starsIconEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path style="fill: currentColor" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>`; //`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path style="fill: currentColor" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.326 18.266l-4.326-2.314-4.326 2.313.863-4.829-3.537-3.399 4.86-.671 2.14-4.415 2.14 4.415 4.86.671-3.537 3.4.863 4.829z"/></svg>`;
            starsIconEl.style.position = 'relative';
            starsIconEl.style.top = '8px'; // '9px';
            starsIconEl.style.marginLeft = '5px';

            const starsAmountEl = document.createElement('span');
            starsAmountEl.style.position = 'relative';
            starsAmountEl.style.top = '7px';

            starsAmountEl.style.fontSize = '18px';
            starsAmountEl.style.fontWeight = '600';

            starsAmountEl.textContent = e.github.stars;

            starsEl.appendChild(starsAmountEl);
            starsEl.appendChild(starsIconEl);

            bottomRightContainerEl.appendChild(repoEl);
            bottomRightContainerEl.appendChild(starsEl);
          }

          if (e.subtext2) {
            let subtext2El = document.createElement('div');
  
            subtext2El.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'description-3_Ncsb', 'formText-3fs7AJ', 'note-1V3kyJ', 'modeDefault-3a2Ph1');
  
            subtext2El.textContent = e.subtext2;

            subtext2El.style.marginTop = '20px';
  
            bottomRightContainerEl.appendChild(subtext2El);
          }

          el.appendChild(bottomContainerEl);

          /*let dividerEl = document.createElement('div');

          dividerEl.classList.add('divider-3573oO', 'dividerDefault-3rvLe-');
          dividerEl.style.marginTop = e.subtext ? '20px' : '45px';

          el.appendChild(dividerEl);*/

          break;
        }

        case 'search': {
          el = document.createElement('div');
          el.classList.add('search-2oPWTC');

          el.innerHTML = `<div class="searchBar-3dMhjb" role="combobox" aria-label="Search" aria-owns="search-results" aria-expanded="false"><div class="DraftEditor-root"><div class="public-DraftEditorPlaceholder-root"><div class="public-DraftEditorPlaceholder-inner" id="placeholder-8kh0r" style="white-space: pre-wrap;">Search</div></div><div class="DraftEditor-editorContainer"><div aria-describedby="placeholder-8kh0r" class="notranslate public-DraftEditor-content" contenteditable="true" role="textbox" spellcheck="false" style="outline: none; user-select: text; white-space: pre-wrap; overflow-wrap: break-word;"><div data-contents="true"><div class="" data-block="true" data-editor="8kh0r" data-offset-key="4l6d8-0-0"><div data-offset-key="4l6d8-0-0" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"><span data-offset-key="4l6d8-0-0">${e.text || ''}<br data-text="true"></span></div></div></div></div></div></div><div class="icon-38sknP iconLayout-1WxHy4 small-1lPjda" tabindex="-1" aria-hidden="true" aria-label="Clear search" role="button"><div class="iconContainer-O4O2CN"><svg class="icon-3cZ1F_ visible-3V0mGj" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.707 20.293L16.314 14.9C17.403 13.504 18 11.799 18 10C18 7.863 17.167 5.854 15.656 4.344C14.146 2.832 12.137 2 10 2C7.863 2 5.854 2.832 4.344 4.344C2.833 5.854 2 7.863 2 10C2 12.137 2.833 14.146 4.344 15.656C5.854 17.168 7.863 18 10 18C11.799 18 13.504 17.404 14.9 16.314L20.293 21.706L21.707 20.293ZM10 16C8.397 16 6.891 15.376 5.758 14.243C4.624 13.11 4 11.603 4 10C4 8.398 4.624 6.891 5.758 5.758C6.891 4.624 8.397 4 10 4C11.603 4 13.109 4.624 14.242 5.758C15.376 6.891 16 8.398 16 10C16 11.603 15.376 13.11 14.242 14.243C13.109 15.376 11.603 16 10 16Z"></path></svg><svg class="icon-3cZ1F_" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg></div></div></div>`;

          let searchbar = el.children[0];

          searchbar.style.width = 'auto';
          searchbar.style.height = '32px';

          if (e.storeSpecific) {
            el.style.marginLeft = '20px';

            el.style.width = '50%'; // Force next element (a card) to go to next line
            el.style.flexGrow = '1'; // Actually grow to fit the whole line
          }

          let root = el.querySelector('.DraftEditor-root');

          root.style.height = '34px';
          root.style.lineHeight = '28px';

          let icons = [...el.getElementsByClassName('icon-3cZ1F_')];

          let iconsContainers = [el.querySelector('.icon-38sknP'), el.querySelector('.iconContainer-O4O2CN'), ...icons];

          iconsContainers[0].style.marginTop = '7px';
          iconsContainers[0].style.marginRight = '4px';

          for (let x of iconsContainers) {
            x.style.width = '20px';
            x.style.height = '20px';
          }

          el.querySelector('.DraftEditor-editorContainer').style.height = '34px';

          let placeholder = el.querySelector('#placeholder-8kh0r');

          let edible = el.querySelector('[contenteditable=true]');

          edible.addEventListener('keydown', (evt) => {
            if (evt.key === 'Enter') {
              evt.preventDefault();
            }
          });

          let inputContainer = edible.children[0].children[0];

          edible.oninput = () => {
            const input = edible.innerText.replace('\n', '');
            const isEmpty = input.length < 1;

            icons[0].style.opacity = isEmpty ? '1' : '0';

            icons[1].style.opacity = isEmpty ? '0' : '1';
            icons[1].style.cursor = isEmpty ? 'auto' : 'pointer';

            placeholder.style.display = isEmpty ? 'block' : 'none';

            e.onchange(input, contentEl);
            e.text = input;
          };

          if (e.text) {
            setTimeout(() => { edible.oninput(); }, 10);
          }

          icons[1].onclick = () => {
            inputContainer.innerHTML = '';

            edible.oninput();
          };

          break;
        }

        case 'sidebar': {
          el = document.createElement('div');

          el.style.backgroundColor = 'var(--background-secondary)';

          el.style.borderRadius = '8px';

          el.style.padding = '14px';

          el.style.marginTop = '4px';
          el.style.marginLeft = '4px';

          el.style.width = '240px';
          el.style.height = 'fit-content';

          el.style.position = 'relative';

          el.style.display = 'flex';
          el.style.flexDirection = 'column';

          e.children(contentEl).then((children) => {
            for (let c of children) {
              switch (c.type) {
                case 'selector': {
                  let mainEl = document.createElement('div');

                  mainEl.classList.add('item-26Dhrx', 'marginBottom8-AtZOdT', 'horizontal-2EEEnY', 'flex-1O1GKY', 'directionRow-3v3tfG');
                  mainEl.setAttribute('role', 'radio');

                  mainEl.style.flex = '1 1 auto';

                  // const selectedClass = 'selected-2DeaDa';

                  // <div class="item-26Dhrx marginBottom8-AtZOdT horizontal-2EEEnY flex-1O1GKY directionRow-3v3tfG" role="radio" aria-checked="true" tabindex="0"><div class="radioBar-bMNUI-" style="padding: 10px;"><svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor"></path><circle cx="12" cy="12" r="5" class="radioIconForeground-XwlXQN" fill="currentColor"></circle></svg><div class="info-3LOr12"><div class="size16-1P40sf title-3BE6m5"><div class="option-2Mjq18"><span class="localeName-2oaRo4">English, US</span><span class="localizedName-2dYMQh">English, US</span><div class="flag-Ve4YnP" aria-hidden="true"><img alt="" src="/assets/e6d6b255259ac878d00819a9555072ad.png" class="flagImage-3Wbkq4"></div></div></div></div></div></div>
                  const unselectedHTML = `<div class="radioBar-bMNUI-" style="padding: 10px;"><svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor"></path></svg><div class="info-3LOr12"><div class="size16-1P40sf title-3BE6m5"><div class="option-2Mjq18"><span class="localeName-2oaRo4">${c.text}</span><span class="localizedName-2dYMQh">${c.subText}</span></div></div></div></div>`;
                  const selectedHTML = `<div class="radioBar-bMNUI-" style="padding: 10px;"><svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor"></path><circle cx="12" cy="12" r="5" class="radioIconForeground-XwlXQN" fill="currentColor"></circle></svg><div class="info-3LOr12"><div class="size16-1P40sf title-3BE6m5"><div class="option-2Mjq18"><span class="localeName-2oaRo4">${c.text}</span><span class="localizedName-2dYMQh">${c.subText}</span></div></div></div></div>`;

                  let selected = c.selected();

                  mainEl.setAttribute('aria-checked', selected.toString());

                  mainEl.innerHTML = selected ? selectedHTML : unselectedHTML;

                  mainEl.onclick = () => {
                    selected = !selected;

                    mainEl.setAttribute('aria-checked', selected.toString());

                    mainEl.innerHTML = selected ? selectedHTML : unselectedHTML;

                    c.onselected(selected, contentEl);
                  };

                  setTimeout(() => { c.onselected(selected, contentEl); }, 10);

                  el.appendChild(mainEl);

                  break;
                }

                case 'divider': {
                  let containerEl = document.createElement('div');

                  containerEl.style.width = '100%';

                  let dividerEl = document.createElement('div');
                  dividerEl.style.marginTop = '25px';

                  dividerEl.classList.add('divider-3573oO', 'dividerDefault-3rvLe-');

                  containerEl.appendChild(dividerEl);

                  if (c.text) {
                    let textEl = document.createElement('div');
                    textEl.classList.add('titleDefault-a8-ZSr', 'title-31JmR4');

                    textEl.style.position = 'relative';
                    textEl.style.top = '-14px';
                    textEl.style.left = '25%';
                    textEl.style.width = '50%';

                    textEl.style.textAlign = 'center';
                    textEl.style.fontSize = '14px';

                    textEl.style.backgroundColor = 'var(--background-tertiary)';
                    textEl.style.padding = '2px';
                    textEl.style.borderRadius = '8px';

                    textEl.innerText = c.text;

                    containerEl.appendChild(textEl);
                  }

                  el.appendChild(containerEl);

                  break;
                }
              }
            }
          });

          break;
        }

        case 'custom': {
          el = e.element;

          break;
        }
      }

      if (specialContainerEl) { // && i > 1
        (e.type === 'card' ? cardContainerEl : specialContainerEl).appendChild(el);
      } else {
        contentEl.appendChild(el);
      }

      i++;
    }

    if (specialContainerEl) {
      specialContainerEl.insertBefore(cardContainerEl, specialContainerEl.children[specialContainerEl.children.length - 1]);
      contentEl.appendChild(specialContainerEl);
    }

    return parentEl;
};

export const makeGooseModSettings = () => {
  const SettingsView = goosemodScope.webpackModules.findByDisplayName('SettingsView');
  const { React } = goosemodScope.webpackModules.common;

  goosemodScope.settingsUninjects = [];

  goosemodScope.settingsUninjects.push(goosemodScope.patcher.patch(SettingsView.prototype, 'getPredicateSections', (_, sections) => {
    if (!sections.find(c => c.section === 'changelog')) return sections;

    const dividers = sections.filter(c => c.section === 'DIVIDER');

    //if (changelog) {
      sections.splice(
        sections.indexOf(dividers[dividers.length - 2]) + 1, 0,

        ...goosemodScope.settings.items.map((i) => {
          switch (i[0]) {
            case 'item':
              let obj = {
                section: i[1],
                label: i[1],
                predicate: () => { alert(1); },
                element: function() {
                  if (typeof i[3] === 'function') {
                    document.getElementsByClassName('selected-3s45Ha')[0].click();

                    i[3]();

                    return React.createElement('div');
                  }


                  settingsLayerEl = document.querySelector('div[aria-label="USER_SETTINGS"]');
                  settingsSidebarEl = settingsLayerEl.querySelector('nav > div');

                  if (i[1] === goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins || i[1] === goosemodScope.i18n.goosemodStrings.settings.itemNames.themes) { // Settings expansion for Module Store panel
                    setTimeout(() => {
                      document.querySelector('.sidebarRegion-VFTUkN').style.maxWidth = '218px';
                      document.querySelector('.contentColumnDefault-1VQkGM').style.maxWidth = '100%';
                    }, 10);

                    settingsSidebarEl.addEventListener('click', (e) => {
                      if (e.clientX === 0 // <el>.click() - not an actual user click - as it has no mouse position coords (0, 0)
                        || e.target.textContent === goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins || e.target.textContent === goosemodScope.i18n.goosemodStrings.settings.itemNames.themes) return;  // Clicking on Module Store when already in it should not break resizing

                      document.querySelector('.sidebarRegion-VFTUkN').style.maxWidth = '50%';
                      document.querySelector('.contentColumnDefault-1VQkGM').style.maxWidth = '740px';
                    });
                  }
                  
                  let contentEl = goosemodScope.settings._createItem(i[1], i[2]);

                  const ref = React.useRef(null);

                  React.useEffect(() => { ref.current.appendChild(contentEl); }, []);

                  return React.createElement('div', {
                    ref
                  });
                  //return React.createElement(VanillaElement, { vanillaChild: contentEl });
                }
              };
              if (i[4]) obj.color = '#f04747';
              return obj;
              //goosemodScope.settings._createItem(i[1], i[2], i[3], i[4]);

            case 'heading':
              return {
                section: 'HEADER',
                label: i[1]
              };

            case 'separator':
              return {
                section: 'DIVIDER'
              };
          }
        }),

        {
          section: 'DIVIDER'
        }
      );
    //}

    const versionInfoEl = sections.find((x) => x.section === 'CUSTOM' && x.element && (x.element()).props?.children[0]?.props?.children[4]?.props.className === 'versionHash-2gXjIB').element();

    // const versionInfo = customSections[customSections.length - 1];
    // const versionInfoEl = versionInfo.element();

    let goosemodVersionInfo = React.cloneElement(versionInfoEl);

    goosemodVersionInfo.props.children = [];

    let goosemodVersion = React.cloneElement(versionInfoEl.props.children[0]);

    goosemodVersion.props.children[0] = 'GooseMod';
    goosemodVersion.props.children[2] = goosemodScope.versioning.version;

    goosemodVersion.props.children[4].props.children[1] = goosemodScope.versioning.hash.substring(0, 7);

    goosemodVersionInfo.props.children.push(goosemodVersion);

    let untetheredVersion = React.cloneElement(versionInfoEl.props.children[1] || versionInfoEl.props.children[2]);

    untetheredVersion.props.children[0] = 'GooseMod Untethered ';
    untetheredVersion.props.children[1] = goosemodScope.untetheredVersion || 'N/A';

    goosemodVersionInfo.props.children.push(untetheredVersion);

    sections.push(
      {
        section: 'DIVIDER'
      },
      {
        section: 'CUSTOM',
        element: () => goosemodVersionInfo
      }
    );

    return sections;
  }));

  goosemodScope.settings.createHeading('GooseMod');

  const updateModuleStoreUI = (parentEl, cards) => {
    const inp = parentEl.querySelector('[contenteditable=true]').innerText.replace('\n', '');

    const fuzzyReg = new RegExp(`.*${inp}.*`, 'i');

    let selectors = {};
    let counts = {};
  
    let noneSelected = true;
    let noneSelectedArray = [];

    for (let s of [...parentEl.children[0].children[4].children]) {
      if (!s.classList.contains('item-26Dhrx')) {
        noneSelectedArray.push(noneSelected);
        noneSelected = true;

        continue;
      }

      const selected = s.getAttribute('aria-checked') === 'true';
      if (selected) {
        noneSelected = false;
      }

      const key = s.children[0].children[1].children[0].children[0].children[0].textContent.toLowerCase();
      counts[key] = {
        el: s,
        count: 0
      };

      selectors[key] = selected; //s.classList.contains(selectedClass);
    }

    noneSelectedArray.push(noneSelected);

    for (let c of cards) {
      const title = c.getElementsByClassName('title-31JmR4')[0];
      const authors = [...title.getElementsByClassName('author')].map((x) => x.textContent.split('#')[0].toLowerCase());
      const name = title.childNodes[0].wholeText;

      const description = c.getElementsByClassName('description-3_Ncsb')[1].innerText;

      const matches = (fuzzyReg.test(name) || fuzzyReg.test(description));

      const importedSelector = c.getElementsByClassName('control-2BBjec')[0] !== undefined ? 'imported' : 'not imported';

      const tags = [...c.classList].map((t) => t.replace(/\|/g, ' ').toLowerCase());

      c.style.display = matches && (
        (tags.some((t) => selectors[t]) || noneSelectedArray[1]) &&
        (authors.some((x) => selectors[x]) || noneSelectedArray[2]) &&
        (selectors[importedSelector] || noneSelectedArray[0]))
        ? 'block' : 'none';

      if (c.style.display !== 'none') {
        tags.forEach((t) => counts[t].count++);
        authors.forEach((x) => counts[x].count++);
        counts[importedSelector].count++;
      }
    }

    const visibleModules = cards.filter((x) => x.style.display !== 'none').length;

    parentEl.getElementsByClassName('divider-3573oO')[0].parentElement.children[1].innerText = `${visibleModules} module${visibleModules !== 1 ? 's' : ''}`;

    for (let k in counts) {
      counts[k].el.children[0].children[1].children[0].children[0].children[1].textContent = counts[k].count;
    }
  };

  let sidebarSelectedIndex = {};

  [goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins, goosemodScope.i18n.goosemodStrings.settings.itemNames.themes].forEach((x) => goosemodScope.settings.createItem(x, ['',
    {
      type: 'button',
      text: goosemodScope.i18n.goosemodStrings.moduleStore.repos.repos,
      onclick: async () => {
        // await goosemodScope.moduleStoreAPI.updateModules();

        // await goosemodScope.moduleStoreAPI.updateStoreSetting();

        // goosemodScope.settings.openSettingItem('Module Store');

        const { React } = goosemodScope.webpackModules.common;
        const SwitchItem = goosemodScope.webpackModules.findByDisplayName('SwitchItem');

        class SwitchItemContainer extends React.Component {
          constructor(props) {
            const originalHandler = props.onChange;
            props.onChange = (e) => {
              originalHandler(e);

              this.props.value = e;
              this.forceUpdate();
            };

            super(props);
          }

          render() {
            //this.props._onRender(this);
            return React.createElement('div', {},
              React.createElement(Button, {
                style: {
                  width: '92px',
                  
                  position: 'absolute',
                  right: '10px',
                  marginTop: '33px'
                },

                color: ButtonClasses['colorRed'],
                size: ButtonClasses['sizeSmall'],

                onClick: this.props.buttonOnClick
              }, goosemodScope.i18n.discordStrings.REMOVE),

              React.createElement(SwitchItem, {
                ...this.props
              })
            );
          }
        }

        let modalCloseHandler = undefined;
        const updateAfterChange = async () => {
          await goosemodScope.moduleStoreAPI.updateModules();

          await goosemodScope.moduleStoreAPI.updateStoreSetting();

          goosemodScope.settings.openSettingItem('Module Store');
        };

        const restartModal = async () => {
          modalCloseHandler();

          await updateAfterChange();

          openReposModal();
        };

        const { Button } = goosemodScope.webpackModules.findByProps('Button');
        const ButtonClasses = goosemodScope.webpackModules.findByProps('button', 'colorRed');

        const ModalStuff = goosemodScope.webpackModules.findByProps('ModalRoot');
        const FormStuff = goosemodScope.webpackModules.findByProps('FormTitle');

        const { openModal } = goosemodScope.webpackModules.findByProps("openModal");

        const Flex = goosemodScope.webpackModules.findByDisplayName('Flex');
        const TextInput = goosemodScope.webpackModules.findByDisplayName('TextInput');

        const openReposModal = () => {
          const repoEls = [];
          let repoInd = 0;

          for (const repo of goosemodScope.moduleStoreAPI.repos) {
            const repoUrl = goosemodScope.moduleStoreAPI.repoURLs.find((x) => x.url === repo.url);

            repoEls.push(React.createElement(SwitchItemContainer, {
              style: {
                marginTop: repoInd === 0 ? '16px' : ''
              },

              note: repo.meta.description,
              value: repo.enabled,

              onChange: (e) => {
                repoUrl.enabled = e;

                updateAfterChange();
              },

              buttonOnClick: async () => {
                goosemodScope.moduleStoreAPI.repoURLs.splice(goosemodScope.moduleStoreAPI.repoURLs.indexOf(repoUrl), 1);

                restartModal();
              }
            }, repo.meta.name));

            repoInd++;
          }

          let currentNewRepoInput = '';

          openModal((e) => {
            modalCloseHandler = e.onClose;

            return React.createElement(ModalStuff.ModalRoot, {
                transitionState: e.transitionState,
                size: 'medium'
              },
              React.createElement(ModalStuff.ModalHeader, {},
                React.createElement(FormStuff.FormTitle, { tag: 'h4' },
                  goosemodScope.i18n.goosemodStrings.moduleStore.repos.repos
                ),
                React.createElement('FlexChild', {
                    basis: 'auto',
                    grow: 0,
                    shrink: 1,
                    wrap: false
                  },
                  React.createElement(ModalStuff.ModalCloseButton, {
                    onClick: e.onClose
                  })
                )
              ),
    
              React.createElement(ModalStuff.ModalContent, {},
                ...repoEls,
                React.createElement(Flex, {
                    style: {
                      marginBottom: '16px'
                    },

                    basis: 'auto',
                    grow: 1,
                    shrink: 1
                  },

                  React.createElement(TextInput, {
                    className: 'codeRedemptionInput-3JOJea',
                    placeholder: 'https://example.com/modules.json',
                    onChange: (e) => {
                      currentNewRepoInput = e;
                    },
                  }),

                  React.createElement(Button, {
                    style: {
                      width: '112px'
                    },
                    // color: ButtonClasses['colorBrand']
                    size: ButtonClasses['sizeMedium'],
                    onClick: async () => {
                      let failed = false;
                      try {
                        const resp = await (await fetch(currentNewRepoInput)).json();

                        failed = resp.meta?.name === undefined;
                      } catch (e) {
                        failed = true;
                      }

                      if (failed) {
                        goosemodScope.showToast(`Invalid Repo`, { type: 'error', timeout: 5000 });

                        return;
                      }

                      const confirmExternal = confirm(`External repos pose security risks as they are not controlled by GooseMod developers. We are not responsible for any dangers because of external repos added by users.\n\nIf you do not trust the owner of this repo do not use it as it could compromise your Discord install.\n\nPlease confirm adding this repo by pressing OK.`);
                      if (!confirmExternal) {
                        goosemodScope.showToast(`Cancelled Adding Repo`, { type: 'danger', timeout: 5000 });

                        return;
                      }


                      goosemodScope.moduleStoreAPI.repoURLs.push({
                        url: currentNewRepoInput,
                        enabled: true
                      });

                      restartModal();
                    }
                  }, goosemodScope.i18n.discordStrings.ADD)
                )
              )
            );
          });
        };

        openReposModal();
      },
      width: 120
    },
    {
      type: 'search',
      onchange: (inp, parentEl) => {
        const cards = [...parentEl.children[0].children[3].children].filter((x) => x.getElementsByClassName('description-3_Ncsb')[1]);

        updateModuleStoreUI(parentEl, cards);
      },
      storeSpecific: true
    },
    {
      type: 'divider',
      text: (parentEl) => {
        return new Promise(async (res) => {
          await sleep(10);

          const cards = [...parentEl.children[0].children[3].children].filter((x) => x.getElementsByClassName('description-3_Ncsb')[1] && x.style.display !== 'none');

          return res(`${cards.length} modules`);
        });
      }
    },
    {
      type: 'sidebar',
      children: (parentEl) => {
        return new Promise(async (res) => {
          await sleep(10);

          const cards = [...parentEl.children[0].children[3].children].filter((x) => x.getElementsByClassName('description-3_Ncsb')[1]);

          let final = [...cards.reduce((acc, e) => {
            const x = e.getElementsByClassName('control-2BBjec')[0] !== undefined ? 'Imported' : 'Not Imported';
            return acc.set(x, (acc.get(x) || 0) + (e.style.display !== 'none' ? 1 : 0));
          }, new Map([
            ['Imported', 0],
            ['Not Imported', 0]
          ])).entries()].sort((a, b) => b[1] - a[1]);

          final.push([goosemodScope.i18n.goosemodStrings.moduleStore.selectors.tags, 0, 'divider']);
          
          final = final.concat([...([].concat.apply([], cards.map((x) => (
            [...x.classList].map((y) => [y.replace(/\|/g, ' '), x.style.display !== 'none'])
          )))).reduce((acc, e) => acc.set(e[0], (acc.get(e[0]) || 0) + (e[1] ? 1 : 0)), new Map()).entries()].sort((a, b) => b[1] - a[1]));

          final.push(['Authors', 0, 'divider']);

          final = final.concat([...cards.reduce((acc, e) => {
            for (let el of e.getElementsByClassName('author')) {
              const x = el.textContent.split('#')[0];
              acc.set(x, (acc.get(x) || 0) + (e.style.display !== 'none' ? 1 : 0));
            }

            return acc;
          }, new Map()).entries()].sort((a, b) => b[1] - a[1]));

          return res(final.map((x) => ({
            text: x[0] === 'ui' ? 'UI' : x[0][0].toUpperCase() + x[0].substring(1),
            subText: x[1],
            type: x[2] || 'selector',
            selected: () => {
              let ind = sidebarSelectedIndex[x[0]];

              if (ind !== undefined) return ind;

              return false;
            },
            onselected: (sel) => {
              sidebarSelectedIndex[x[0]] = sel;

              updateModuleStoreUI(parentEl, cards);
            }
          })));
        });
      }
    }
  ]));

  goosemodScope.settings.createItem('Change Log', [""], async () => {
    GoosemodChangelog.show();
  });
  
  /* goosemodScope.settings.createItem('Uninstall', [""], async () => {
    if (await goosemodScope.confirmDialog('Uninstall', 'Uninstall GooseMod', 'Are you sure you want to uninstall GooseMod? This is a quick uninstall, it may leave some code behind but there should be no remaining noticable changes.')) {
      goosemodScope.settings.closeSettings();

      goosemodScope.remove();
    }
  }, true); */

  /*if (window.DiscordNative !== undefined) {
    goosemodScope.settings.createItem('Local Reinstall', [''], async () => {
      if (await goosemodScope.confirmDialog('Reinstall', 'Reinstall GooseMod', 'Are you sure you want to reinstall GooseMod? This will uninstall GooseMod, then ask you for the inject.js file, then run it to reinstall.')) {
        goosemodScope.settings.closeSettings();

        goosemodScope.remove();

        eval(ab2str((await DiscordNative.fileManager.openFiles())[0].data));
      }
    }, true);
  }*/

  goosemodScope.settings.createSeparator();

  goosemodScope.settings.createHeading(goosemodScope.i18n.goosemodStrings.settings.itemNames.goosemodModules);

  addToContextMenu();
};

const addToContextMenu = () => {
  const basicSettingItem = (name) => {
    return {
      label: name,
      action: async () => {
        goosemodScope.settings.openSettings();

        await sleep(10);

        [...(document.getElementsByClassName('side-8zPYf6')[0]).children].find((x) => x.textContent === name).click();
      }
    };
  };

  goosemodScope.settingsUninjects.push(goosemodScope.patcher.contextMenu.patch('user-settings-cog', {
    label: 'GooseMod',
    sub: [
      basicSettingItem(goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins),
      basicSettingItem(goosemodScope.i18n.goosemodStrings.settings.itemNames.themes),
      basicSettingItem('Change Log')
    ]
  }));

  goosemodScope.settingsUninjects.push(goosemodScope.patcher.contextMenu.patch('user-settings-cog', {
    label: goosemodScope.i18n.goosemodStrings.settings.itemNames.goosemodModules,
    sub: () => {
      const moduleItems = goosemodScope.settings.items.slice(goosemodScope.settings.items.indexOf(goosemodScope.settings.items.find((x) => x[1] === goosemodScope.i18n.goosemodStrings.settings.itemNames.goosemodModules)) + 1);

      return moduleItems.map((x) => basicSettingItem(x[1]));
    }
  }));
};