import sleep from '../../util/sleep';

import * as GMSettings from '../../gmSettings';
export const gmSettings = GMSettings;

import addToHome from './home';
import addToContextMenu from './contextMenu';
import addToSettingsSidebar from './settingsSidebar';

import addBaseItems from './baseItems';


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

//const settings = {
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

const sessionStoreSelected = {};

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

    const currentDate = new Date();

    if (panelName === goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins || panelName === goosemodScope.i18n.goosemodStrings.settings.itemNames.themes) {
      specialContainerEl = document.createElement('div');

      specialContainerEl.style.display = 'flex';
      specialContainerEl.style.flexDirection = 'row';
      specialContainerEl.style.flexWrap = 'wrap';

      cardContainerEl = document.createElement('div');

      cardContainerEl.style.display = 'grid';

      cardContainerEl.style.gridTemplateColumns = 'repeat(auto-fill, 350px)';
      cardContainerEl.style.gridTemplateRows = 'repeat(auto-fill, 400px)';

      cardContainerEl.style.width = '100%';
      cardContainerEl.style.justifyContent = 'center';

      /*cardContainerEl.style.columnGap = '10px';
      cardContainerEl.style.rowGap = '10px';*/

      /* document.querySelector('.sidebarRegion-VFTUkN').style.transition = '0.5s max-width';
  
      document.querySelector('.contentColumnDefault-1VQkGM').style.transition = '0.5s max-width'; */
    }

    const makeCard = (e) => {
      let el = document.createElement('div');

      if (e.tags) e.tags.forEach((x) => el.classList.add(x.replace(/ /g, '|')));

      //if (e.class) el.classList.add(e.class);

      el.style.boxShadow = 'var(--elevation-medium)';
      el.style.backgroundColor = 'var(--background-secondary)';

      el.style.borderRadius = '8px';
      el.style.boxSizing = 'border-box';

      el.style.padding = '12px';
      el.style.margin = '10px';

      el.style.width = '330px';
      el.style.height = '380px';

      el.style.position = 'relative';

      let headerEl = document.createElement('div');

      const hasImage = e.images && e.images[0];

      headerEl.style.backgroundImage = hasImage ? `url("${e.images[0]}")` : '';
      headerEl.style.width = 'calc(100% + 24px)';
      headerEl.style.height = '200px';
      headerEl.style.borderRadius = '8px 8px 0 0';

      headerEl.style.marginTop = '-12px';
      headerEl.style.marginLeft = '-12px';

      headerEl.style.backgroundColor = 'var(--background-secondary-alt)';
      headerEl.style.backgroundRepeat = 'no-repeat';
      headerEl.style.backgroundSize = 'contain';
      headerEl.style.backgroundPosition = '50%';

      if (!hasImage) {
        headerEl.textContent = 'No Preview';

        headerEl.style.textAlign = 'center';
        headerEl.style.lineHeight = '200px';

        headerEl.style.color = 'var(--interactive-normal)';
        headerEl.style.fontFamily = 'var(--font-display)';
        headerEl.style.fontSize = '36px';
      }

      el.appendChild(headerEl);

      let authorEl = document.createElement('div');

      authorEl.classList.add('titleDefault-a8-ZSr', 'title-31JmR4');

      authorEl.style.position = 'absolute';
      authorEl.style.top = '152px';
      authorEl.style.right = '10px';

      authorEl.style.opacity = '0.95';

      authorEl.style.borderRadius = '16px';

      if (e.author.includes('avatar')) { // Has pfps
        authorEl.style.paddingRight = '10px';
      } else { // Does not have pfps
        authorEl.style.padding = '4px 8px';
      }

      authorEl.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

      authorEl.style.width = 'fit-content';

      authorEl.innerHTML = e.author;

      el.appendChild(authorEl);

      let checked = e.isToggled();

      let toggleEl = document.createElement('div');
      toggleEl.classList.add('control-2BBjec');
      
      let offHTML = '<div class="container-3auIfb" tabindex="-1" style="opacity: 1; background-color: rgb(114, 118, 125);"><svg class="slider-TkfMQL" viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" style="left: -3px;"><rect fill="white" x="4" y="0" height="20" width="20" rx="10"></rect><svg viewBox="0 0 20 20" fill="none"><path fill="rgba(114, 118, 125, 1)" d="M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z"></path><path fill="rgba(114, 118, 125, 1)" d="M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z"></path></svg></svg><input id="uid_328" type="checkbox" class="input-rwLH4i" tabindex="0"></div>';
      let onHTML = '<div class="container-3auIfb" tabindex="-1" style="opacity: 1; background-color: rgb(59, 165, 92);"><svg class="slider-TkfMQL" viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" style="left: 12px;"><rect fill="white" x="4" y="0" height="20" width="20" rx="10"></rect><svg viewBox="0 0 20 20" fill="none"><path fill="rgba(67, 181, 129, 1)" d="M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z"></path><path fill="rgba(67, 181, 129, 1)" d="M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z"></path></svg></svg><input id="uid_328" type="checkbox" class="input-rwLH4i" tabindex="0"></div>';

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

      toggleEl.style.display = e.showToggle ? 'block' : 'none';

      toggleEl.style.marginTop = '4px';

      toggleEl.style.position = 'absolute';
      toggleEl.style.right = '-10px';

      let txtEl = document.createElement('span');
      
      txtEl.style.cursor = 'auto';

      txtEl.classList.add('titleDefault-a8-ZSr', 'title-31JmR4');
      txtEl.style.marginTop = '10px';

      txtEl.style.width = '85%';

      txtEl.style.overflow = 'hidden';
      txtEl.style.display = '-webkit-box';
      txtEl.style.webkitLineClamp = '1';
      txtEl.style.webkitBoxOrient = 'vertical';

      txtEl.innerHTML = e.name;

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
          authorsEl.innerHTML = authorEl.innerHTML;

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

          extraInfoEl.children[0].style.marginBottom = '10px';

          extraInfoEl.children[1].style.marginTop = '4px';

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

      bottomContainerEl.appendChild(toggleEl);

      let bottomRightContainerEl = document.createElement('div');

      bottomRightContainerEl.style.display = 'flex';
      bottomRightContainerEl.style.alignItems = 'center';
      bottomRightContainerEl.style.flexDirection = 'column';

      bottomRightContainerEl.style.order = '2';
      bottomRightContainerEl.style.marginLeft = 'auto';

      bottomRightContainerEl.style.position = 'absolute';
      bottomRightContainerEl.style.top = '208px';
      bottomRightContainerEl.style.right = '12px';

      // bottomContainerEl.appendChild(bottomRightContainerEl);
      el.appendChild(bottomRightContainerEl);

      if (e.github) {
        const repoEl = document.createElement('div');
        // repoEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path style="fill: currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
        // repoEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'description-3_Ncsb', 'formText-3fs7AJ', 'modeDefault-3a2Ph1');
        repoEl.classList.add('button-38aScr', 'lookFilled-1Gx00P', 'colorGrey-2DXtkV', 'sizeSmall-2cSMqn', 'grow-q77ONN');

        // repoEl.href = `https://github.com/${e.github.repo}`;
        // repoEl.target = '_blank';

        // repoEl.style.position = 'relative';
        repoEl.style.marginLeft = '14px';

        repoEl.style.minWidth = '0px';
        repoEl.style.padding = '2px 5px';

        repoEl.style.color = '#ddd';

        repoEl.onclick = () => {
          window.open(`https://github.com/${e.github.repo}`);
        };

        // repoEl.style.top = '5px';

        // repoEl.style.cursor = 'pointer';

        /* buttonEl.onclick = () => {
          e.onclick(buttonEl);
        }; */

        repoEl.style.display = 'inline-flex';

        repoEl.style.cursor = 'pointer';

        // repoEl.style.width = '90px';

        let repoContentsEl = document.createElement('div');

        repoContentsEl.classList.add('contents-18-Yxp');

        repoContentsEl.style.position = 'relative';
        repoContentsEl.style.top = '1px';

        repoContentsEl.innerHTML = `<svg style="vertical-align: middle;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path style="fill: currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;

        repoEl.appendChild(repoContentsEl);

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

        bottomContainerEl.appendChild(repoEl);

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

      if ((currentDate - (e.lastUpdated * 1000)) / 1000 / 60 / 60 / 24 < 5) {
        const updatedBadgeEl = document.createElement('div');

        updatedBadgeEl.classList.add('textBadge-1iylP6', 'base-PmTxvP', 'baseShapeRound-1Mm1YW');
        updatedBadgeEl.style.backgroundColor = 'var(--brand-experiment)';

        updatedBadgeEl.textContent = 'UPDATED';

        updatedBadgeEl.style.position = 'absolute';
        updatedBadgeEl.style.top = '10px';
        updatedBadgeEl.style.right = '10px';
        updatedBadgeEl.style.opacity = '0.8';

        el.appendChild(updatedBadgeEl);
      }

      return el;
    };

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
          let onHTML = '<div class="container-3auIfb" tabindex="-1" style="opacity: 1; background-color: rgb(59, 165, 92);"><svg class="slider-TkfMQL" viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" style="left: 12px;"><rect fill="white" x="4" y="0" height="20" width="20" rx="10"></rect><svg viewBox="0 0 20 20" fill="none"><path fill="rgba(67, 181, 129, 1)" d="M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z"></path><path fill="rgba(67, 181, 129, 1)" d="M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z"></path></svg></svg><input id="uid_328" type="checkbox" class="input-rwLH4i" tabindex="0"></div>';

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

            subtextEl.innerHTML = e.subtext;

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
          let onHTML = '<div class="container-3auIfb" tabindex="-1" style="opacity: 1; background-color: rgb(59, 165, 92);"><svg class="slider-TkfMQL" viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" style="left: 12px;"><rect fill="white" x="4" y="0" height="20" width="20" rx="10"></rect><svg viewBox="0 0 20 20" fill="none"><path fill="rgba(67, 181, 129, 1)" d="M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z"></path><path fill="rgba(67, 181, 129, 1)" d="M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z"></path></svg></svg><input id="uid_328" type="checkbox" class="input-rwLH4i" tabindex="0"></div>';

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
          let onHTML = '<div class="container-3auIfb" tabindex="-1" style="opacity: 1; background-color: rgb(59, 165, 92);"><svg class="slider-TkfMQL" viewBox="0 0 28 20" preserveAspectRatio="xMinYMid meet" style="left: 12px;"><rect fill="white" x="4" y="0" height="20" width="20" rx="10"></rect><svg viewBox="0 0 20 20" fill="none"><path fill="rgba(67, 181, 129, 1)" d="M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z"></path><path fill="rgba(67, 181, 129, 1)" d="M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z"></path></svg></svg><input id="uid_328" type="checkbox" class="input-rwLH4i" tabindex="0"></div>';

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

        case 'store-header': {
          el = document.createElement('div');
          el.classList.add('headerContainer-1Wluzl');

          el.style.marginBottom = '0';

          const headerContentEl = document.createElement('div');
          headerContentEl.classList.add('colorHeaderPrimary-26Jzh-', 'size20-17Iy80', 'pageHeader-3nuK1W');

          headerContentEl.textContent = e.text;
  
          el.appendChild(headerContentEl);

          break;
        }

        case 'store-category': {
          el = document.createElement('div');
          el.classList.add('storeCategory');

          el.style.width = '100%';

          // <div class="headerContainer-1Wluzl"><div class="colorHeaderPrimary-26Jzh- size20-17Iy80 pageHeader-3nuK1W">Live Stages</div></div>
          const headerEl = document.createElement('div');
          headerEl.classList.add('headerContainer-1Wluzl');

          headerEl.style.marginBottom = '0';

          const headerContentEl = document.createElement('div');
          headerContentEl.classList.add('colorHeaderPrimary-26Jzh-', 'size20-17Iy80', 'pageHeader-3nuK1W');

          headerContentEl.textContent = e.text;
  
          headerEl.appendChild(headerContentEl);

          el.appendChild(headerEl);

          const cardsEl = document.createElement('div');
          cardsEl.classList.add('scrollerBase-289Jih', 'auto-Ge5KZx', 'scrollerBase-289Jih');

          cardsEl.style.display = 'grid';
          cardsEl.style.overflowX = 'scroll';

          cardsEl.style.gridTemplateColumns = 'repeat(auto-fill, 350px)';
          cardsEl.style.gridAutoFlow = 'column';

          cardsEl.style.width = '100%';

          const cards = content.filter((x) => x.type === 'card').sort(e.sort);
          
          cardsEl.append(...cards.slice(0, 10).map((x) => makeCard(x)));

          el.appendChild(cardsEl);

          break;
        }

        case 'card': {
          el = makeCard(e);

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
            // el.style.width = '30%'; // Force next element (a card) to go to next line
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

          el.style.order = '1';

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
          if (typeof e.element === 'function') {
            el = e.element();
          } else {
            el = e.element;
          }

          break;
        }

        case 'gm-footer': {
          el = document.createElement('div');

          el.style.display = 'flex';
          el.style.flexWrap = 'wrap';
          el.style.justifyContent = 'space-between';
          el.style.order = '2';

          let dividerEl = document.createElement('div');
          dividerEl.style.marginTop = '25px';
          dividerEl.style.width = '100%';

          dividerEl.classList.add('divider-3573oO', 'dividerDefault-3rvLe-');

          el.appendChild(dividerEl);

          const textEl = document.createElement('div');

          textEl.textContent = `GooseMod is an independent and upcoming Discord mod, mostly by one developer with inspiration and help from the community.
You can help the development of GooseMod by spreading the word and financial support via GitHub Sponsors.`;

          textEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'description-3_Ncsb', 'formText-3fs7AJ', 'modeDefault-3a2Ph1');

          textEl.style.marginTop = '15px';
          textEl.style.width = '80%';

          el.appendChild(textEl);

          const iconsEl = document.createElement('div');
          
          iconsEl.style.marginTop = '15px';

          const repoEl = document.createElement('a');
          repoEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path style="fill: currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
          repoEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'description-3_Ncsb', 'formText-3fs7AJ', 'modeDefault-3a2Ph1');

          repoEl.href = `https://github.com/GooseMod/GooseMod`;
          repoEl.target = '_blank';

          repoEl.style.height = 'fit-content';
          repoEl.style.margin = '8px';

          repoEl.style.cursor = 'pointer';

          repoEl.onmouseover = function () { this.style.color = '#eee'; };
          repoEl.onmouseleave = function () { this.style.color = ''; };

          const sponsorEl = document.createElement('a');
          sponsorEl.innerHTML = `<svg height="32" viewBox="0 0 16 16" width="32"><path style="fill: currentColor" fill-rule="evenodd" d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5zM8 14.25l-.345.666-.002-.001-.006-.003-.018-.01a7.643 7.643 0 01-.31-.17 22.075 22.075 0 01-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.08 22.08 0 01-3.744 2.584l-.018.01-.006.003h-.002L8 14.25zm0 0l.345.666a.752.752 0 01-.69 0L8 14.25z"></path></svg>`;
          sponsorEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'description-3_Ncsb', 'formText-3fs7AJ', 'modeDefault-3a2Ph1');

          sponsorEl.href = `https://github.com/sponsors/CanadaHonk`;
          sponsorEl.target = '_blank';

          sponsorEl.style.height = 'fit-content';
          sponsorEl.style.margin = '8px';

          sponsorEl.style.cursor = 'pointer';

          sponsorEl.onmouseover = function () { this.style.color = '#eee'; };
          sponsorEl.onmouseleave = function () { this.style.color = ''; };

          iconsEl.appendChild(sponsorEl);

          iconsEl.appendChild(repoEl);

          el.appendChild(iconsEl);

          break;
        }

        case 'dropdown-individual': {
          el = document.createElement('div');

          el.style.marginLeft = '20px';
          el.style.lineHeight = '32px';

          const labelEl = document.createElement('label');

          labelEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'description-3_Ncsb', 'formText-3fs7AJ', 'note-1V3kyJ', 'modeDefault-3a2Ph1');

          labelEl.style.display = 'inline';
          labelEl.style.marginRight = '8px';

          labelEl.textContent = e.label;

          el.appendChild(labelEl);

          const dropEl = document.createElement('select');

          let selected = '';
          
          if (e.selected) {
            selected = e.selected();
          } else {
            selected = sessionStoreSelected[e.label];
          }

          e.options(contentEl).then((options) => options.forEach((x) => {
            const optionEl = document.createElement('option');

            optionEl.value = x;
            optionEl.textContent = x;

            if (x === selected) {
              optionEl.selected = true;
            }

            dropEl.appendChild(optionEl);
          }));

          dropEl.onchange = () => {
            sessionStoreSelected[e.label] = dropEl.value;

            e.onchange(dropEl.value, contentEl);
          };

          setTimeout(() => { dropEl.onchange(); }, 10);

          dropEl.style.maxWidth = '120px';

          dropEl.style.background = 'var(--background-secondary)';
          dropEl.style.color = 'var(--header-primary)';
          dropEl.style.border = 'none';
          dropEl.style.padding = '8px';

          el.appendChild(dropEl);

          break;
        }

        case 'dropdown': {
          el = document.createElement('div');

          el.classList.add('marginBottom20-32qID7');

          let txtEl = document.createElement('span');
          txtEl.classList.add('titleDefault-a8-ZSr', 'title-31JmR4');

          txtEl.style.float = 'left';

          txtEl.innerHTML = e.text;

          const dropEl = document.createElement('select');

          let selected = '';
          
          if (e.selected) {
            selected = e.selected();
          } else {
            selected = sessionStoreSelected[e.label];
          }

          e.options(contentEl).then((options) => options.forEach((x) => {
            const optionEl = document.createElement('option');

            optionEl.value = x;
            optionEl.textContent = x;

            if (x === selected) {
              optionEl.selected = true;
            }

            dropEl.appendChild(optionEl);
          }));

          dropEl.onchange = () => {
            sessionStoreSelected[e.label] = dropEl.value;

            e.onchange(dropEl.value, contentEl);
          };

          dropEl.style.background = 'var(--background-secondary)';
          dropEl.style.color = 'var(--header-primary)';
          dropEl.style.border = 'none';
          dropEl.style.padding = '8px';
          dropEl.style.float = 'right';

          el.appendChild(txtEl);
          el.appendChild(dropEl);

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

        case 'text-input': {
          el = document.createElement('div');

          el.classList.add('marginBottom20-32qID7');

          let txtEl = document.createElement('span');
          txtEl.classList.add('titleDefault-a8-ZSr', 'title-31JmR4');

          txtEl.style.float = 'left';

          txtEl.innerHTML = e.text;

          const inpEl = document.createElement('input');
          inpEl.type = 'text';

          if (e.initialValue) {
            inpEl.value = e.initialValue();
          }

          inpEl.onchange = () => {
            e.oninput(inpEl.value, contentEl);
          };

          inpEl.style.background = 'var(--background-secondary)';
          inpEl.style.color = 'var(--header-primary)';
          inpEl.style.border = 'none';
          inpEl.style.padding = '8px';
          inpEl.style.float = 'right';

          el.appendChild(txtEl);
          el.appendChild(inpEl);

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
  goosemodScope.settingsUninjects = [];

  addBaseItems(goosemodScope, gmSettings);

  addToSettingsSidebar(goosemodScope, gmSettings);
  addToContextMenu(goosemodScope, gmSettings.get().home);
  if (gmSettings.get().home) addToHome(goosemodScope);
};