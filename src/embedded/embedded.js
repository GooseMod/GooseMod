(async function () {
  this.version = '0.9.0';
  this.embedded = true;

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

  this.importModules = async (files) => {
    this.logger.debug('import', 'Looping through files');

    for (let f of files) {
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
        }
      };

      settingItem[2].push(toggleObj);

      this.logger.debug(`import.load.module.${field}`, `Added to Modules setting page`);
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
    let files = await this.getModuleFiles();

    await this.importModules(files);

    return files;
  };

  this.settings.createHeading('GooseMod');

  this.settings.createItem('Manage Modules', ['',
    {
      type: 'button',
      text: 'Import Modules',
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

  this.settings.createItem('Uninstall', [""], async () => {
    if (await this.confirmDialog('Uninstall', 'Uninstall GooseMod', 'Are you sure you want to uninstall GooseMod? This is a quick uninstall, it may leave some code behind but there should be no remaining noticable changes.')) {
      this.settings.close();

      this.remove();
    }
  }, true);

  this.settings.createItem('Reinstall', [''], async () => {
    if (await this.confirmDialog('Reinstall', 'Reinstall GooseMod', 'Are you sure you want to reinstall GooseMod? This will uninstall GooseMod, then ask you for the inject.js file, then run it to reinstall.')) {
      this.settings.close();

      this.remove();

      eval(ab2str((await DiscordNative.fileManager.openFiles())[0].data));
    }
  }, true);

  this.settings.createSeparator();

  this.settings.createHeading('GooseMod Modules');

  if (this.embedded === true) {
    await this.importModules([
      {
    filename: 'fucklytics.js',
    data: `let version = '1.1.2';

let enabled = true;

let blocking = {
  'science': true,
  'sentry': true
};

let _XMLHttpRequest = XMLHttpRequest;

let obj = {
  onImport: async function() {
    let gooseModScope = this;

    this.logger.debug('fucklytics', 'Overriding XMLHTTPRequest with a proxy function');

    window.XMLHttpRequest = function() {
      var xhr = new _XMLHttpRequest();
  
      var _open = xhr.open;
      xhr.open = function() {
          //console.log(this, arguments, arguments[1], arguments[1].includes('science'));
          if (enabled) {
            if (blocking['science'] === true && arguments[1].includes('/v8/science')) {
              gooseModScope.logger.debug('fucklytics', 'Blocked analytics request (science)');

              return false;
            }

            if (blocking['sentry'] === true && arguments[1].includes('https://sentry.io')) {
              gooseModScope.logger.debug('fucklytics', 'Blocked analytics request (sentry)');

              return false;
            }
          }

          return _open.apply(this, arguments);
      }
  
      return xhr;
    }
  },

  onLoadingFinished: async function() {
    this.settings.createItem('Fucklytics', [
      \`(v\${version})\`,

      {
        type: 'toggle',
        text: 'Fucklytics Enabled',
        onToggle: (c) => { enabled = c; },
        isToggled: () => enabled
      },

      {
        type: 'header',
        text: 'Types to Block'
      },

      {
        type: 'toggle',
        text: 'Science (Discord API)',
        subtext: 'Discord\\'s own analytics, most used',
        onToggle: (c) => { blocking['science'] = c; },
        isToggled: () => blocking['science']
      },
      {
        type: 'toggle',
        text: 'Sentry.io',
        subtext: 'Used to track console / JS errors',
        onToggle: (c) => { blocking['sentry'] = c; },
        isToggled: () => blocking['sentry']
      }
    ]);
  },

  remove: async function() {
    enabled = false;

    window.XMLHttpRequest = _XMLHttpRequest;

    let settingItem = this.settings.items.find((x) => x[1] === 'Fucklytics');
    this.settings.items.splice(this.settings.items.indexOf(settingItem), 1);
  },

  logRegionColor: 'darkblue',

  name: 'Fucklytics',
  description: 'Blocks analytics',

  author: 'Ducko',

  version
};

obj`
  },{
    filename: 'devMode.js',
    data: `let version = '1.0.1';

function byProperties(props, filter = m => m) {
	return module => {
		const component = filter(module);
		if (!component) return false;
		return props.every(property => component[property] !== undefined);
	};
}

function newDev() {
	const filter = byProperties(["isDeveloper"]);
	const modules = webpackJsonp.push([[], {a: (m, e, t) => m.exports = t.c},[ ['a'] ]]);
	for (const index in modules) {
		const {exports} = modules[index];
		if (!exports) continue;
		if (exports.__esModule && exports.default && filter(exports.default))  {
			Object.defineProperty(exports.default, 'isDeveloper', { configurable: true, writable: true, value: 1 });
		}
	}
}

let obj = {
  onImport: async function() {
    this.logger.debug('devMode', 'Enabling Developer Mode');

    newDev();
	},
	
	remove: async function() {

	},

	logRegionColor: 'darkgreen',
	
	name: 'Dev Mode',
	description: 'Enables developer mode (experiments, etc.)',

	author: 'Ducko',

  version
};

obj`
  },{
    filename: 'visualTweaks.js',
    data: `let version = '2.0.1';

let obj = {
  onImport: async function() {
    this.logger.debug('visualTweaks', 'Enabling Visual Tweaks');
    
    this.tweaks = {
      'removeHelpButton': true,
      'darkerMode': true,
      'darkestMode': true
    };

    let sheet = window.document.styleSheets[0];

    // Darker Theme / Mode
    sheet.insertRule(\`body.theme-darker {
    --background-primary: #000;
    --background-secondary: #111;
    --background-secondary-alt: #000;
    --background-tertiary: #222;

    --channeltextarea-background: #111;
    --background-message-hover: rgba(255,255,255,0.025);

    --background-accent: #222;
    --background-floating: #111;
    }\`, sheet.cssRules.length);

    // Darkest Theme / Mode
    sheet.insertRule(\`html > body.theme-darkest {
    --background-primary: #000;
    --background-secondary: #050505;
    --background-secondary-alt: #000;
    --background-tertiary: #080808;

    --channeltextarea-background: #080808;

    --background-accent: #111;
    --background-floating: #080808;
    }\`, sheet.cssRules.length);

    // Friends menu main container - fix hard coded colors
    sheet.insertRule(\`body.theme-darker .container-1D34oG {
      background-color: var(--background-primary);
    }\`, sheet.cssRules.length);

    // Autocomplete slash and mention menu - fix hard coded colors
    sheet.insertRule(\`body.theme-darker .autocomplete-1vrmpx {
      background-color: var(--background-floating);
    }\`, sheet.cssRules.length);
    sheet.insertRule(\`body.theme-darker .selectorSelected-1_M1WV {
      background-color: var(--background-accent);
    }\`, sheet.cssRules.length);

    // Profile popup - fix hard coded colors
    sheet.insertRule(\`body.theme-darker .body-3iLsc4, body.theme-darker .footer-1fjuF6 {
      background-color: var(--background-floating);
    }\`, sheet.cssRules.length);

    // Server Boost layer / page - fix hard coded colors
    sheet.insertRule(\`body.theme-darker .perksModal-fSYqOq {
      background-color: var(--background-primary);
    }\`, sheet.cssRules.length);

    sheet.insertRule(\`body.theme-darker .tierBody-16Chc9 {
      background-color: var(--background-floating);
    }\`, sheet.cssRules.length);

    sheet.insertRule(\`body.theme-darker .perk-2WeBWW {
      background-color: var(--background-floating);
    }\`, sheet.cssRules.length);

    
    let tweakFunctions = {
      'removeHelpButton': {
        enable: () => {
          document.querySelector('a[href="https://support.discord.com"] > div[role="button"]').parentElement.style.display = 'none';
        },
        
        disable: () => {
          document.querySelector('a[href="https://support.discord.com"] > div[role="button"]').parentElement.style.display = 'flex';
        }
      },

      'darkerMode': {
        enable: () => {
          document.body.classList.add('theme-darker');
        },

        disable: () => {
          document.body.classList.remove('theme-darker');
        }
      },
      'darkestMode': {
        enable: () => {
          document.body.classList.add('theme-darkest');
        },

        disable: () => {
          document.body.classList.remove('theme-darkest');
        }
      }
    };
    
    this.enableTweak = (tweakName) => {
      tweakFunctions[tweakName].enable();

      this.tweaks[tweakName] = true;
    };
    
    this.disableTweak = (tweakName) => {
      tweakFunctions[tweakName].disable();

      this.tweaks[tweakName] = false;
    };
    
    this.setTweak = (tweakName, value) => {
      if (value === true) {
        this.enableTweak(tweakName);
      } else {
        this.disableTweak(tweakName);
      }
    };
  },
  
  onLoadingFinished: async function() {
    for (let t in this.tweaks) {
      if (this.tweaks[t] === true) this.enableTweak(t);
    }

    this.settings.createItem('Visual Tweaks', [
      \`(v\${version})\`,

      {
        type: 'header',
        text: 'Themes'
      },
      {
        type: 'toggle',
        text: 'Darker Mode',
        subtext: 'A more darker mode',
        onToggle: (c) => { this.setTweak('darkerMode', c); },
        isToggled: () => this.tweaks['darkerMode']
      },
      {
        type: 'toggle',
        text: 'Darkest Mode',
        subtext: 'Pure dark',
        onToggle: (c) => { this.setTweak('darkestMode', c); },
        isToggled: () => this.tweaks['darkestMode']
      },

      {
        type: 'header',
        text: 'Individual Minor Tweaks'
      },
      {
        type: 'toggle',
        text: 'Hide Help Button',
        subtext: 'Hides the help button in the top right corner',
        onToggle: (c) => { this.setTweak('removeHelpButton', c); },
        isToggled: () => this.tweaks['removeHelpButton']
      }
    ]);
  },

  remove: async function() {
    for (let t in this.tweaks) {
      if (this.tweaks[t] === true) this.disableTweak(t);
    }

    let settingItem = this.settings.items.find((x) => x[1] === 'Visual Tweaks');
    this.settings.items.splice(this.settings.items.indexOf(settingItem), 1);
  },
  
  logRegionColor: 'darkred',

  name: 'Visual Tweaks',
  description: 'A variety of visual tweaks, including themes and small changes',

  author: 'Ducko',

  version
};

obj`
  },{
    filename: 'twitchEmotes.js',
    data: `let version = '1.0.0';

let emotes = {"4Head":"354","ANELE":"3792","ArgieB8":"51838","ArsonNoSexy":"50","AsianGlow":"74","AthenaPMS":"32035","BabyRage":"22639","BatChest":"1905","BCouch":"83536","BCWarrior":"30","BibleThump":"86","BigBrother":"1904","BionicBunion":"24","BlargNaut":"38","bleedPurple":"62835","BloodTrail":"69","BORT":"243","BrainSlug":"881","BrokeBack":"4057","BuddhaBar":"27602","ChefFrank":"90129","cmonBruh":"84608","CoolCat":"58127","CorgiDerp":"49106","CougarHunt":"21","DAESuppy":"973","DansGame":"33","DatSheffy":"170","DBstyle":"73","deExcite":"46249","deIlluminati":"46248","DendiFace":"58135","DogFace":"1903","DOOMGuy":"54089","duDudu":"62834","EagleEye":"20","EleGiggle":"4339","FailFish":"360","FPSMarksman":"42","FrankerZ":"65","FreakinStinkin":"39","FUNgineer":"244","FunRun":"48","FuzzyOtterOO":"168","GingerPower":"32","GrammarKing":"3632","HassaanChop":"20225","HassanChop":"68","HeyGuys":"30259","HotPokket":"357","HumbleLife":"46881","ItsBoshyTime":"169","Jebaited":"90","JKanStyle":"15","JonCarnage":"26","KAPOW":"9803","Kappa":"25","KappaClaus":"74510","KappaPride":"55338","KappaRoss":"70433","KappaWealth":"81997","Keepo":"1902","KevinTurtle":"40","Kippa":"1901","Kreygasm":"41","Mau5":"30134","mcaT":"35063","MikeHogu":"81636","MingLee":"68856","MrDestructoid":"28","MVGame":"29","NinjaTroll":"45","NomNom":"90075","NoNoSpot":"44","NotATK":"34875","NotLikeThis":"58765","OhMyDog":"81103","OMGScoots":"91","OneHand":"66","OpieOP":"356","OptimizePrime":"16","OSfrog":"81248","OSkomodo":"81273","OSsloth":"81249","panicBasket":"22998","PanicVis":"3668","PartyTime":"76171","PazPazowitz":"19","PeoplesChamp":"3412","PermaSmug":"27509","PeteZaroll":"81243","PeteZarollTie":"81244","PicoMause":"27","PipeHype":"4240","PJSalt":"36","PMSTwin":"92","PogChamp":"88","Poooound":"358","PraiseIt":"38586","PRChase":"28328","PunchTrees":"47","PuppeyFace":"58136","RaccAttack":"27679","RalpherZ":"1900","RedCoat":"22","ResidentSleeper":"245","riPepperonis":"62833","RitzMitz":"4338","RuleFive":"361","SeemsGood":"64138","ShadyLulu":"52492","ShazBotstix":"87","ShibeZ":"27903","SmoocherZ":"89945","SMOrc":"52","SMSkull":"51","SoBayed":"1906","SoonerLater":"355","SriHead":"14706","SSSsss":"46","StinkyCheese":"90076","StoneLightning":"17","StrawBeary":"37","SuperVinlin":"31","SwiftRage":"34","TF2John":"1899","TheRinger":"18","TheTarFu":"70","TheThing":"7427","ThunBeast":"1898","TinyFace":"67","TooSpicy":"359","TriHard":"171","TTours":"38436","twitchRaid":"62836","UleetBackup":"49","UncleNox":"3666","UnSane":"71","VaultBoy":"54090","VoHiYo":"81274","Volcania":"166","WholeWheat":"1896","WinWaker":"167","WTRuck":"1897","WutFace":"28087","YouWHY":"4337"};

let interval;

let obj = {
  onImport: async function() {
  },

  onLoadingFinished: async function() {
    interval = setInterval(() => {
      let els = [...document.getElementsByClassName('messageContent-2qWWxC')];
      for (let el of els) {
        for (let e in emotes) {
          if (!el.textContent.includes(e)) continue;

          for (let n of el.childNodes) {
            if (!n.textContent.includes(e)) continue;

            const results = n.textContent.match(new RegExp(\`([\\\\s]|^)\${e}([\\\\s]|\$)\`));

            if (!results) continue;
            
            const pre = n.textContent.substring(0, results.index + results[1].length);
            const post = n.textContent.substring(results.index + results[0].length - results[2].length);

            n.textContent = pre;

            let emojiContainerEl = document.createElement('span');
            emojiContainerEl.classList.add('emojiContainer-3X8SvE');

            emojiContainerEl.setAttribute('role', 'button');
            emojiContainerEl.setAttribute('tabindex', '0');

            let imgEl = document.createElement('img');
            imgEl.src = \`https://static-cdn.jtvnw.net/emoticons/v1/\${emotes[e]}/1.0\`;

            imgEl.classList.add('emoji', 'jumboable');

            imgEl.draggable = false;
            imgEl.setAttribute('aria-label', e);

            emojiContainerEl.appendChild(imgEl);

            el.insertBefore(emojiContainerEl, n.nextSibling);

            el.insertBefore(document.createTextNode(post), emojiContainerEl.nextSibling);
          }
        }
      }
    }, 100);
  },

  remove: async function() {
    clearInterval(interval);
    /*let settingItem = this.settings.items.find((x) => x[1] === 'BetterTTV Emotes');
    this.settings.items.splice(this.settings.items.indexOf(settingItem), 1);*/
  },

  logRegionColor: 'green',

  name: 'Twitch Emotes',
  description: 'Converts text into images for Twitch global emotes',

  author: 'Ducko',

  version
};

obj`
  },{
    filename: 'roleColoredMessages.js',
    data: `let version = '1.0.0';

let interval;

function rgb2hsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

let obj = {
  onImport: async function() {
  },

  onLoadingFinished: async function() {
    interval = setInterval(() => {
      let els = [...document.getElementsByClassName('contents-2mQqc9')];
      for (let el of els) {
        el.querySelector('.markup-2BOw-j').style.color = el.querySelector('.username-1A8OIy').style.color;

        /*let rgb = el.querySelector('.username-1A8OIy').style.color.replace('rgb(', '').replace(')', '').split(', ').map((x) => parseFloat(x));

        let [h, s, l] = rgb2hsl(rgb[0], rgb[1], rgb[2]);

        el.querySelector('.markup-2BOw-j').style.color = \`hsl(\${h}, \${s + 10}%, \${l + 10}%)\`;*/
      }
    }, 100);
  },

  remove: async function() {
    clearInterval(interval);

    let els = [...document.getElementsByClassName('contents-2mQqc9')]; // Reset message text back to normal color
      for (let el of els) {
        el.querySelector('.markup-2BOw-j').style.color = ''; //el.querySelector('.username-1A8OIy').style.color;
      }
  },

  logRegionColor: 'green',

  name: 'Role Colored Messages',
  description: 'Makes message text color the same as the sender\\'s role color',

  author: 'Ducko',

  version
};

obj`
  },
    ]);

    for (let p in this.modules) {
      if (this.modules.hasOwnProperty(p) && this.modules[p].onLoadingFinished !== undefined) {
        await this.modules[p].onLoadingFinished();

        this.logger.debug(`import.module.runOnLoadingFinishedHandler.${p}`, 'Ran onLoadingFinished()');
      }
    }
  }

  this.remove = () => {
    this.removed = true;

    for (let p in this.modules) {
      if (this.modules.hasOwnProperty(p) && this.modules[p].remove !== undefined) {
        this.modules[p].remove();
      }
    }
  };

  this.settings.close();

  await sleep(20);

  this.settings.open();

  await sleep(20);

  [...settingsSidebarGooseModContainer.children].find((x) => x.textContent === 'Manage Modules').click();
}).bind({})();