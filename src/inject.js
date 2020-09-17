window.GooseMod = {};

(async function() {
  this.version = 'v0.2.1';
  this.versionIteration = 24;

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  this.logger = {
    regionColors: {
      'import': 'rgb(100, 0, 0)'
    },

    debug: (region, ...args) => {
      let parentRegion = region.split('.')[0];
      console.log(`%cGooseMod%c %c${region}`, 'border: 1px solid white; padding: 2px; background-color: black; color: white', 'background-color: none', `border: 1px solid white; padding: 2px; background-color: ${this.logger.regionColors[parentRegion] || (this.modules[parentRegion] && this.modules[parentRegion].logRegionColor) || 'rgb(0, 0, 0)'}; color: white`, ...(args));
    }
  };

  console.log(`%cGooseMod%c %c${this.version} %c${this.versionIteration}`, 'border: 1px solid white; padding: 2px; background-color: black; color: white', 'background-color: none', 'color: lightgreen', 'color: salmon');

  this.modules = {};

  const ab2str = (buf) => { // ArrayBuffer (UTF-8) -> String
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  this.importModules = async (files) => {
    this.logger.debug('import', 'Looping through files');

    for (let f of files) {
      let field = f.filename.split('.').slice(0, -1).join('.'); // Get name of module via filename (taking away the file extension)

      this.logger.debug('import', `Importing module: "${field}"`);

      this.modules[field] = eval(ab2str(f.data)); // Set this.modules.<module_name> to the return value of the module (an object containing handlers)

      this.logger.debug(`import.load.module.${field}`, `Evaled module JS`);

      this.bindHandlers(this.modules[field]); // Bind all handlers to module parent / returned object from module code

      this.logger.debug(`import.load.module.${field}`, `Binded handlers`);

      await this.modules[field].onImport(); // Run the module's onImport handler

      this.logger.debug(`import.load.module.${field}`, `Ran onImport()`);
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

  await this.importModules(await this.getModuleFiles());

  // Do settings UI stuff
  /*let settingsLayerEl = document.querySelector('div[aria-label="USER_SETTINGS"]');

  let settingsSidebarEl = settingsLayerEl.querySelector('nav > div');
  
  let settingsMainEl = settingsLayerEl.querySelector('main > div');

  let settingsButtonEl = document.querySelector('button[aria-label="User Settings"]');

  let settingsClasses = {};

  for (let e of settingsSidebarEl.children) {
    for (let c of e.classList) {
      let name = c.split('-')[0];

      if (settingsClasses[name] === undefined) {
        settingsClasses[name] = c;
      }
    }
  }*/

  let settingsButtonEl = document.querySelector('button[aria-label="User Settings"]');

  let settingsLayerEl, settingsSidebarEl, settingsMainEl, settingsClasses;

  this.settings = {
    items: [],

    createItem: (panelName, content) => {
      this.settings.items.push(['item', panelName, content]);
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
            this.settings._createItem(i[1], i[2]);
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

    _createItem: (panelName, content) => {
      let parentEl = document.createElement('div');

      let headerEl = document.createElement('h2');
      headerEl.textContent = panelName;

      headerEl.classList.add('colorStandard-2KCXvj', 'size14-e6ZScH', 'h2-2gWE-o', 'title-3sZWYQ', 'defaultColor-1_ajX0', 'defaultMarginh2-2LTaUL');

      parentEl.appendChild(headerEl);

      let contentEl = document.createElement('div');
      contentEl.className = 'children-rWhLdy';

      parentEl.appendChild(contentEl);
      
      let i = 0;
      for (let e of content) {
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

            txtEl.textContent = e.text;

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

              e.onToggle(checked);
            };

            toggleEl.style.float = 'right';

            el.appendChild(txtEl);
            el.appendChild(toggleEl);

            let dividerEl = document.createElement('div');

            dividerEl.classList.add('divider-3573oO', 'dividerDefault-3rvLe-');
            dividerEl.style.marginTop = '50px';

            el.appendChild(dividerEl);
        }

        contentEl.appendChild(el);

        if (e.type === 'toggle') {
          
        }

        i++;
      }

      let el = document.createElement('div');

      el.classList.add(settingsClasses['item']);
      el.classList.add(settingsClasses['themed']);

      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');

      el.innerText = panelName;

      el.onclick = () => {
        setTimeout(() => {
          settingsMainEl.firstChild.innerHTML = '';
          settingsMainEl.firstChild.appendChild(parentEl);

          //settingsMainEl.firstChildElement.innerHTML = '';

          //settingsMainEl.firstChildElement.appendChild(contentEl);

          for (let e of settingsSidebarEl.children) {
            e.classList.remove(settingsClasses['selected']);
          }

          el.classList.add(settingsClasses['selected']);
        }, 10);
      };

      settingsSidebarEl.addEventListener('click', () => {
        el.classList.remove(settingsClasses['selected']);
      });

      settingsSidebarEl.appendChild(el);
    },

    _createHeading: (headingName) => {
      let el = document.createElement('div');
      el.className = settingsClasses['header'];

      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');

      el.innerText = headingName;

      settingsSidebarEl.appendChild(el);
    },

    _createSeparator: () => {
      let el = document.createElement('div');
      el.className = settingsClasses['separator'];

      settingsSidebarEl.appendChild(el);
    }
  };

  settingsButtonEl.addEventListener('click', async () => {
    await sleep(100);

    settingsLayerEl = document.querySelector('div[aria-label="USER_SETTINGS"]');

    settingsSidebarEl = settingsLayerEl.querySelector('nav > div');
  
    settingsMainEl = settingsLayerEl.querySelector('main');

    settingsButtonEl = document.querySelector('button[aria-label="User Settings"]');

    settingsClasses = {};

    for (let e of settingsSidebarEl.children) {
      for (let c of e.classList) {
        let name = c.split('-')[0];

        if (settingsClasses[name] === undefined) {
          settingsClasses[name] = c;
        }
      }
    }

    this.settings.createFromItems();
  });

  this.settings.createSeparator();
  this.settings.createHeading('GooseMod');

  for (let p in this.modules) {
    if (this.modules.hasOwnProperty(p) && this.modules[p].onLoadingFinished !== undefined) {
      await this.modules[p].onLoadingFinished();

      this.logger.debug(`import.module.runOnLoadingFinishedHandler.${p}`, 'Ran onLoadingFinished()');
    }
  }
}).bind(window.GooseMod)();