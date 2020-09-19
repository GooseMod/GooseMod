(async function () {
  this.version = '1.0.0';

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const reopenSettings = async () => {
    this.settings.close();

    await sleep(50);

    this.settings.open();

    await sleep(50);

    [...settingsSidebarGooseModContainer.children].find((x) => x.textContent === 'Module Store').click();
  };

  this.cspBypasser = {
    frame: document.createElement('iframe'),

    init: async () => {
      this.cspBypasser.frame.src = `${location.origin}/api/404`;
      document.body.appendChild(this.cspBypasser.frame);

      await sleep(1000);

      let script = document.createElement('script');
      script.type = 'text/javascript';

      let code = `
      window.addEventListener('message', async (e) => {
        const {url, type} = e.data;

        const req = await fetch(\`https://cors-anywhere.herokuapp.com/\${url}\`, {
          cache: 'no-store'
        });

        e.source.postMessage(type === 'json' ? await req.json() : (type === 'text' ? await req.text() : await req.blob()));
      }, false);`;

      script.appendChild(document.createTextNode(code));

      this.cspBypasser.frame.contentDocument.head.appendChild(script);
    },

    json: (url) => {
      return new Promise((res) => {
        this.cspBypasser.frame.contentWindow.postMessage({url, type: 'json'});

        window.addEventListener('message', async (e) => {
          res(e.data);
        }, false);
      });
    },

    text: (url) => {
      return new Promise((res) => {
        this.cspBypasser.frame.contentWindow.postMessage({url, type: 'text'});

        window.addEventListener('message', async (e) => {
          res(e.data);
        }, false);
      });
    },

    blob: (url) => {
      return new Promise((res) => {
        this.cspBypasser.frame.contentWindow.postMessage({url, type: 'blob'});

        window.addEventListener('message', async (e) => {
          res(e.data);
        }, false);
      });
    },
  };

  await this.cspBypasser.init();

  this.moduleStoreAPI = {
    modules: [],

    apiBaseURL: 'https://gitdab.com/duck/GooseMod-JSONAPI/raw/branch/master/api',

    updateModules: async () => {
      this.moduleStoreAPI.modules = await this.cspBypasser.json(`${this.moduleStoreAPI.apiBaseURL}/modules.json`);
    },

    importModule: async (moduleName) => {
      const moduleInfo = this.moduleStoreAPI.modules.find((x) => x.filename === moduleName);

      const jsCode = await this.cspBypasser.text(moduleInfo.codeURL);

      await this.importModule({
        filename: `${moduleInfo.filename}.js`,
        data: jsCode
      });

      if (this.modules[moduleInfo.filename].onLoadingFinished !== undefined) {
        await this.modules[moduleInfo.filename].onLoadingFinished();
      }

      let settingItem = this.settings.items.find((x) => x[1] === 'Module Store');

      let item = settingItem[2].find((x) => x.subtext === moduleInfo.description);

      item.type = 'text-and-danger-button';
      item.buttonText = 'Reimport';

      reopenSettings();
    },

    moduleRemoved: async (m) => {
      let item = settingItem[2].find((x) => x.subtext === m.description);

      item.type = 'text-and-button';
      item.buttonText = 'Import';
    },

    updateStoreSetting: () => {
      let item = this.settings.items.find((x) => x[1] === 'Module Store');

      item[2] = item[2].slice(0, 3);

      for (let m of this.moduleStoreAPI.modules) {
        item[2].push({
          type: 'text-and-button',
          text: `${m.name} <span class="description-3_Ncsb">by</span> ${m.author} <span class="description-3_Ncsb">(v${m.version})</span>`,
          buttonText: 'Import',
          subtext: m.description,
          onclick: () => {
            this.moduleStoreAPI.importModule(m.filename);

            this.settings.close();
          }
        });
      }
    }
  };

  await this.moduleStoreAPI.updateModules();

  this.logger = {
    regionColors: {
      'import': 'rgb(100, 0, 0)'
    },

    log: [],

    debug: (region, ...args) => {
      let parentRegion = region.split('.')[0];
      console.log(`%cGooseMod%c %c${region}`, 'border: 1px solid white; padding: 2px; background-color: black; color: white', 'background-color: none', `border: 1px solid white; padding: 2px; background-color: ${this.logger.regionColors[parentRegion] || (this.modules[parentRegion] && this.modules[parentRegion].logRegionColor) || 'rgb(0, 0, 0)'}; color: white`, ...(args));
      //log.push(`${region}: ${args.join(' ')}`);
    }
  };

  this.logger.debug('import.version.goosemod', `${this.version}-${this.versionIteration}`);

  if (window.DiscordNative !== undefined) this.logger.debug('import.version.discord', `${DiscordNative.app.getReleaseChannel()} ${DiscordNative.app.getVersion()}`);

  // Settings UI stuff

  this.confirmDialog = (buttonText, title, description) => {
    return new Promise((res) => {
    //Making the div boxes to house the stuff
    let confirmELContainer = document.createElement('div');
    confirmELContainer.classList.add('layerContainer-yqaFcK');

    let confirmELLayer = document.createElement('div');
    confirmELLayer.classList.add('layer-2KE1M9');

    let confirmEL = document.createElement('div');
    confirmEL.classList.add("focusLock-Ns3yie");
    confirmEL.setAttribute('role', 'dialog');
    confirmEL.setAttribute('aria-label', title);
    confirmEL.setAttribute('tabindex', '-1');
    confirmEL.setAttribute('aria-model', 'true');

    let confirmELRoot = document.createElement('div');
    confirmELRoot.classList.add("root-1gCeng", "small-3iVZYw", "fullscreenOnMobile-1bD22y");
    confirmELRoot.style.opacity = '1';
    confirmELRoot.style.transform = 'scale(1)';

    //Header stuff
    let confirmELHeaderDiv = document.createElement('div');
    confirmELHeaderDiv.classList.add('flex-1xMQg5', 'flex-1O1GKY', 'horizontal-1ae9ci', 'horizontal-2EEEnY', 'flex-1O1GKY', 'directionRow-3v3tfG', 'justifyStart-2NDFzi', 'alignCenter-1dQNNs', 'noWrap-3jynv6', 'header-1TKi98');
    confirmELHeaderDiv.style.flex = '0 0 auto';

    let confirmElHeaderH = document.createElement('h4');
    confirmElHeaderH.classList.add("colorStandard-2KCXvj", "size14-e6ZScH", "h4-AQvcAz", "title-3sZWYQ", "defaultColor-1_ajX0", "defaultMarginh4-2vWMG5");
    confirmElHeaderH.textContent = title;

    //Body stuff
    let confirmELBody = document.createElement('div');
    confirmELBody.classList.add('content-1LAB8Z', 'content-mK72R6', 'thin-1ybCId', 'scrollerBase-289Jih');
    confirmELBody.setAttribute('dir', 'ltr');
    confirmELBody.style.overflow = 'hidden scroll';
    confirmELBody.style.paddingRight = '8px';

    let confirmELBodyText = document.createElement('div')
    confirmELBodyText.classList.add('colorStandard-2KCXvj', 'size16-1P40sf')
    confirmELBodyText.textContent = description;

    let confirmELBodyWhitespace = document.createElement('div');
    confirmELBodyWhitespace.setAttribute('aria-hidden', 'true');
    confirmELBodyWhitespace.style.position = 'absolute';
    confirmELBodyWhitespace.style.pointerEvents = 'none';
    confirmELBodyWhitespace.style.minHeight = '0px';
    confirmELBodyWhitespace.style.minWidth = '1px';
    confirmELBodyWhitespace.style.flex = '0 0 auto';
    confirmELBodyWhitespace.style.height = '20px';

    //Button stuff
    let confirmELButtonsDiv = document.createElement('div');
    confirmELButtonsDiv.classList.add('flex-1xMQg5', 'flex-1O1GKY', 'horizontalReverse-2eTKWD', 'horizontalReverse-3tRjY7', 'flex-1O1GKY', 'directionRowReverse-m8IjIq', 'justifyStart-2NDFzi', 'alignStretch-DpGPf3', 'noWrap-3jynv6', 'footer-2gL1pp');

    let confirmELButtonsSubmit = document.createElement('button');
    confirmELButtonsSubmit.type = 'submit';
    confirmELButtonsSubmit.classList.add('button-38aScr', 'lookFilled-1Gx00P', 'colorRed-1TFJan', 'sizeMedium-1AC_Sl', 'grow-q77ONN');

    let confirmELButtonsSubmitDiv = document.createElement('div');
    confirmELButtonsSubmitDiv.classList.add('contents-18-Yxp');
    confirmELButtonsSubmitDiv.textContent = buttonText;

    let confirmELButtonsCancel = document.createElement('button');
    confirmELButtonsCancel.type = 'button';
    confirmELButtonsCancel.classList.add('button-38aScr', 'lookLink-9FtZy-', 'colorPrimary-3b3xI6', 'sizeMedium-1AC_Sl', 'grow-q77ONN');

    let confirmELButtonsCancelDiv = document.createElement('div');
    confirmELButtonsCancelDiv.classList.add('contents-18-Yxp');
    confirmELButtonsCancelDiv.textContent = 'Cancel';

    //Misc
    let confirmELDimBackgroundDiv = document.createElement('div');
    confirmELDimBackgroundDiv.classList.add('backdropWithLayer-3_uhz4');
    confirmELDimBackgroundDiv.style.opacity = '0.85';
    confirmELDimBackgroundDiv.style.backgroundColor = 'rgb(0, 0, 0)';
    confirmELDimBackgroundDiv.style.transform = 'translateZ(0px)';

    //Add all the elements to the document
    //Appending misc
    confirmELContainer.appendChild(confirmELDimBackgroundDiv);

    //Appending root elements
    confirmELContainer.appendChild(confirmELLayer);
    confirmELLayer.appendChild(confirmEL);
    confirmEL.appendChild(confirmELRoot);

    //Appending headers
    confirmELRoot.appendChild(confirmELHeaderDiv);
    confirmELHeaderDiv.appendChild(confirmElHeaderH);

    //Appending body
    confirmELRoot.appendChild(confirmELBody);
    confirmELBody.appendChild(confirmELBodyText);
    confirmELBody.appendChild(confirmELBodyWhitespace);

    //Appending buttons
    confirmELRoot.appendChild(confirmELButtonsDiv);

    confirmELButtonsDiv.appendChild(confirmELButtonsSubmit);
    confirmELButtonsDiv.appendChild(confirmELButtonsCancel);
    confirmELButtonsSubmit.appendChild(confirmELButtonsSubmitDiv);
    confirmELButtonsCancel.appendChild(confirmELButtonsCancelDiv);

    //Inserting element into document
    document.getElementById('app-mount').insertBefore(confirmELContainer, null);

    //Making it function
    confirmELButtonsSubmit.onclick = () => {
      confirmELLayer.remove();
      confirmELDimBackgroundDiv.remove();

      res(true);
    };

    confirmELButtonsCancel.onclick = () => {
      confirmELLayer.remove();
      confirmELDimBackgroundDiv.remove();

      res(false);
    };

    confirmELDimBackgroundDiv.onclick = () => {
      confirmELLayer.remove();
      confirmELDimBackgroundDiv.remove();
    };

    document.querySelector('div[aria-label="Close"]').onclick = () => {
      confirmELLayer.remove();
      confirmELDimBackgroundDiv.remove();
    };
    });
  };

  let settingsButtonEl = document.querySelector('button[aria-label="User Settings"]');

  let settingsLayerEl, settingsSidebarEl, settingsSidebarGooseModContainer, settingsMainEl, settingsClasses;

  this.settings = {
    items: [],

    createItem: (panelName, content, clickHandler, danger = false) => {
      this.settings.items.push(['item', panelName, content, clickHandler, danger]);
    },

    createHeading: (headingName) => {
      this.settings.items.push(['heading', headingName]);
    },

    createSeparator: () => {
      this.settings.items.push(['separator']);
    },

    createFromItems: () => {
      for (let i of this.settings.items) {
        switch (i[0]) {
          case 'item':
            this.settings._createItem(i[1], i[2], i[3], i[4]);
            break;
          case 'heading':
            this.settings._createHeading(i[1]);
            break;
          case 'separator':
            this.settings._createSeparator();
            break;
        }
      }
    },

    _createItem: (panelName, content, clickHandler, danger = false) => {
      let parentEl = document.createElement('div');

      let headerEl = document.createElement('h2');
      headerEl.textContent = `${panelName} ${content[0]}`;

      headerEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'h2-2gWE-o', 'title-3sZWYQ', 'defaultColor-1_ajX0', 'defaultMarginh2-2LTaUL');

      parentEl.appendChild(headerEl);

      let contentEl = document.createElement('div');
      contentEl.className = 'children-rWhLdy';

      parentEl.appendChild(contentEl);

      let i = 0;
      for (let e of content.slice(1)) {
        let el;

        switch (e.type) {
          case 'header':
            el = document.createElement('h2');

            if (i !== 0) {
              el.classList.add('marginTop20-3TxNs6');
            }

            el.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'h5-18_1nd', 'title-3sZWYQ', 'marginBottom8-AtZOdT');

            el.textContent = e.text;
            break;

          case 'toggle':
            el = document.createElement('div');

            el.classList.add('marginBottom20-32qID7');

            let txtEl = document.createElement('span');
            txtEl.classList.add('titleDefault-a8-ZSr', 'title-31JmR4');

            txtEl.style.float = 'left';

            txtEl.innerHTML = e.text;

            let checked = e.isToggled();

            let checkedClass = 'valueChecked-m-4IJZ';
            let uncheckedClass = 'valueUnchecked-2lU_20';

            let toggleEl = document.createElement('div');
            toggleEl.classList.add('flexChild-faoVW3', 'switchEnabled-V2WDBB', 'switch-3wwwcV', checked ? checkedClass : uncheckedClass, 'value-2hFrkk', 'sizeDefault-2YlOZr', 'size-3rFEHg', 'themeDefault-24hCdX');

            toggleEl.onclick = () => {
              checked = !checked;

              if (checked) {
                toggleEl.classList.add(checkedClass);
                toggleEl.classList.remove(uncheckedClass);
              } else {
                toggleEl.classList.remove(checkedClass);
                toggleEl.classList.add(uncheckedClass);
              }

              e.onToggle(checked, el);
            };

            toggleEl.style.float = 'right';

            el.appendChild(txtEl);
            el.appendChild(toggleEl);

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
              e.onclick(el);
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
                e.onclick(el);
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

          case 'button':
            el = document.createElement('button');

            el.classList.add('button-38aScr', 'lookFilled-1Gx00P', 'colorBrand-3pXr91', 'sizeSmall-2cSMqn', 'grow-q77ONN');

            let contentsEl = document.createElement('div');

            contentsEl.classList.add('contents-18-Yxp');

            contentsEl.textContent = e.text;

            el.appendChild(contentsEl);

            el.onclick = e.onclick;

            break;
        }

        contentEl.appendChild(el);

        i++;
      }

      let el = document.createElement('div');

      el.classList.add(settingsClasses['item']);
      el.classList.add(settingsClasses['themed']);

      if (danger) {
        el.style.color = 'rgb(240, 71, 71)';

        el.onmouseenter = () => {
          el.style.backgroundColor = 'rgba(240, 71, 71, 0.1)';
        };

        el.onmouseleave = () => {
          el.style.backgroundColor = 'unset';
        };
      }

      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');

      el.innerText = panelName;

      el.onclick = async () => {
        if (clickHandler !== undefined) {
          clickHandler();

          return; 
        }

        setTimeout(() => {
          settingsMainEl.firstChild.innerHTML = '';
          settingsMainEl.firstChild.appendChild(parentEl);

          for (let e of settingsSidebarEl.children) {
            e.classList.remove(settingsClasses['selected']);
          }

          el.classList.add(settingsClasses['selected']);
        }, 10);
      };

      settingsSidebarEl.addEventListener('click', () => {
        if (this.removed === true) return;

        el.classList.remove(settingsClasses['selected']);
      });

      settingsSidebarGooseModContainer.appendChild(el);
    },

    _createHeading: (headingName) => {
      let el = document.createElement('div');
      el.className = settingsClasses['header'];

      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');

      el.innerText = headingName;

      settingsSidebarGooseModContainer.appendChild(el);
    },

    _createSeparator: () => {
      let el = document.createElement('div');
      el.className = settingsClasses['separator'];

      settingsSidebarGooseModContainer.appendChild(el);
    },

    close: () => {
      let closeEl = document.querySelector('div[aria-label="Close"]');
      
      if (closeEl === null) return false;
      
      closeEl.click(); // Close settings via clicking the close settings button
    },

    open: () => {
      settingsButtonEl.click();
    }
  };

  settingsButtonEl.addEventListener('click', async () => {
    if (this.removed) return;

    await sleep(10);

    settingsLayerEl = document.querySelector('div[aria-label="USER_SETTINGS"]');

    settingsSidebarEl = settingsLayerEl.querySelector('nav > div');

    settingsClasses = {};

    for (let e of settingsSidebarEl.children) {
      for (let c of e.classList) {
        let name = c.split('-')[0];

        if (settingsClasses[name] === undefined) {
          settingsClasses[name] = c;
        }
      }
    }

    settingsSidebarGooseModContainer = document.createElement('div');
    settingsSidebarEl.insertBefore(settingsSidebarGooseModContainer, settingsSidebarEl.childNodes[settingsSidebarEl.childElementCount - 4]);//settingsSidebarEl.querySelector(`.${settingsClasses.item}:not(${settingsClasses.themed}) ~ ${settingsClasses.item}:not(${settingsClasses.themed})`));

    let el = document.createElement('div');
    el.className = settingsClasses['separator'];

    settingsSidebarEl.insertBefore(el, settingsSidebarGooseModContainer.nextSibling); //.insertBefore(settingsSidebarGooseModContainer, settingsSidebarEl.childNodes[settingsSidebarEl.childElementCount - 4]);//settingsSidebarEl.querySelector(`.${settingsClasses.item}:not(${settingsClasses.themed}) ~ ${settingsClasses.item}:not(${settingsClasses.themed})`));
    
    let versionEl = document.createElement('div');
    versionEl.classList.add('colorMuted-HdFt4q', 'size12-3cLvbJ');

    versionEl.textContent = `GooseMod ${this.version}`;

    settingsSidebarEl.lastChild.appendChild(versionEl);

    settingsMainEl = settingsLayerEl.querySelector('main');

    this.settings.createFromItems();
  });

  this.modules = {};

  const ab2str = (buf) => { // ArrayBuffer (UTF-8) -> String
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  };

  this.importModule = async (f) => {
    let field = f.filename.split('.').slice(0, -1).join('.'); // Get name of module via filename (taking away the file extension)

    this.logger.debug('import', `Importing module: "${field}"`);
      
    let settingItem = this.settings.items.find((x) => x[1] === 'Manage Modules');

    if (this.modules[field] !== undefined) {
      this.logger.debug(`import.load.module.${field}`, 'Module already imported, removing then installing new version');

      await this.modules[field].remove();

      settingItem[2].splice(settingItem[2].indexOf(settingItem[2].find((x) => x.text === `${this.modules[field].name} (${this.modules[field].version})`)), 1);
    }

    if (typeof f.data === 'object') { // ArrayBuffer (UTF-8) -> String
      f.data = ab2str(f.data);
    }

    this.modules[field] = eval(f.data); // Set this.modules.<module_name> to the return value of the module (an object containing handlers)

    this.logger.debug(`import.load.module.${field}`, `Evaled module JS`);

    this.bindHandlers(this.modules[field]); // Bind all handlers to module parent / returned object from module code

    this.logger.debug(`import.load.module.${field}`, `Binded handlers`);

    await this.modules[field].onImport(); // Run the module's onImport handler

    this.logger.debug(`import.load.module.${field}`, `Ran onImport()`);

    let toggleObj = {
      type: 'text-and-danger-button',
      text: `${this.modules[field].name} <span class="description-3_Ncsb">by</span> ${this.modules[field].author} <span class="description-3_Ncsb">(v${this.modules[field].version})</span>`,
      buttonText: 'Remove',
      subtext: this.modules[field].description,
      onclick: (el) => {
        this.modules[field].remove();

        settingItem[2].splice(settingItem[2].indexOf(toggleObj), 1);

        let settingEl = [...settingsSidebarGooseModContainer.children].find((x) => x.textContent === this.modules[field].name);
          
        if (settingEl !== undefined) settingEl.remove();

        el.remove();

        delete this.modules[field];

        this.moduleStoreAPI.moduleRemoved(this.mdoules[field]);
      }
    };

    settingItem[2].push(toggleObj);

    this.logger.debug(`import.load.module.${field}`, `Added to Modules setting page`);
  };

  this.importModules = async (files) => {
    this.logger.debug('import', 'Looping through files');

    for (let f of files) {
      this.importModule(f);
    }

    this.logger.debug('import', 'Imported all files');
  };

  this.bindHandlers = (handlers) => {
    for (let p in handlers) {
      if (handlers.hasOwnProperty(p) && typeof handlers[p] === 'function') {
        handlers[p] = handlers[p].bind(this);
      }
    }

    return handlers;
  };

  this.getModuleFiles = async () => { // Ask for module files (one by one due to Discord restraint) until no file is chosen
    this.logger.debug('import.fileask', 'Asking for files');

    let allFiles = [];

    while (true) {
      let files = await DiscordNative.fileManager.openFiles(); // Ask for file (singular)

      if (files.length === 0) { // If no file, stop asking for files
        break;
      }

      allFiles.push(files[0]); // Add file to files array
    }

    this.logger.debug('import.fileask', 'Finished asking for files');

    return allFiles;
  };

  this.importModulesFull = async () => {
    if (window.DiscordNative === undefined) {
      alert('Not supported in browser');
      return [];
    }

    let files = await this.getModuleFiles();

    await this.importModules(files);

    return files;
  };

  this.settings.createHeading('GooseMod');

  this.settings.createItem('Manage Modules', ['',
    {
      type: 'button',
      text: 'Import Local Modules',
      onclick: async () => {
        let files = await this.importModulesFull();

        for (let f of files) {
          let n = f.filename.split('.').slice(0, -1).join('.');

          if (this.modules[n].onLoadingFinished !== undefined) {
            await this.modules[n].onLoadingFinished();
          }
        }

        this.settings.close();
      },
    },

    {
      type: 'header',
      text: 'Imported Modules'
    }
  ]);

  this.settings.createItem('Module Store', ['',
    {
      type: 'button',
      text: 'Update Index',
      onclick: async () => {
        await this.moduleStoreAPI.updateModules();

        await this.moduleStoreAPI.updateStoreSetting();

        reopenSettings();
      },
    },

    {
      type: 'header',
      text: 'Available Modules'
    }
  ]);

  this.settings.createSeparator();

  this.settings.createItem('Uninstall', [""], async () => {
    if (await this.confirmDialog('Uninstall', 'Uninstall GooseMod', 'Are you sure you want to uninstall GooseMod? This is a quick uninstall, it may leave some code behind but there should be no remaining noticable changes.')) {
      this.settings.close();

      this.remove();
    }
  }, true);

  if (window.DiscordNative !== undefined) {
    this.settings.createItem('Reinstall', [''], async () => {
      if (await this.confirmDialog('Reinstall', 'Reinstall GooseMod', 'Are you sure you want to reinstall GooseMod? This will uninstall GooseMod, then ask you for the inject.js file, then run it to reinstall.')) {
        this.settings.close();

        this.remove();

        eval(ab2str((await DiscordNative.fileManager.openFiles())[0].data));
      }
    }, true);
  }

  this.settings.createSeparator();

  this.settings.createHeading('GooseMod Modules');

  this.remove = () => {
    this.removed = true;

    for (let p in this.modules) {
      if (this.modules.hasOwnProperty(p) && this.modules[p].remove !== undefined) {
        this.modules[p].remove();
      }
    }
  };

  await this.moduleStoreAPI.updateStoreSetting();

  reopenSettings();
}).bind({})();