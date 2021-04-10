let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

let themes = [
  'Dracula Theme',
  'Darkest Theme',
  'Solarized Dark Theme',
  //'Slate'
];

let packs = [
  {
    text: 'Minimal',
    subtext: 'A basic installation with no visual changes; only analytics blocking and fixes',
    modules: ['Hardcoded Color Fixer', 'Fucklytics']
  },
  {
    text: 'Recommended',
    subtext: 'The recommended starting experience: a few visual improvements and customisation options',
    modules: ['Visual Tweaks', 'Username In Author', 'Custom Sounds', 'Better Message Deletion', 'Nickname Panel'],
    base: 'Minimal'
  },
  {
    text: 'Complete',
    subtext: 'A large amount of the avaliable modules which overhauls the UI and adds extra features',
    modules: ['WYSIWYG Messages', 'Twitch Emotes', 'RadialStatus', 'Simple Status Icons', 'User Popout Creation Date', 'Clear Recent Games', 'Game Activity Button', 'Macros', 'Role Colored Messages'],
    base: 'Recommended'
  }
];

packs = packs.map((x) => {
  if (x.base) {
    let basePack = packs.find((y) => y.text === x.base);
    x.modules = basePack.modules.concat(...x.modules);
  }

  return x;
});

const selectionModal = (title, options) => {
  return new Promise((res) => {
    goosemodScope.webpackModules.findByPropsAll('show')[0].show({
      title,
      
      body: 'Body'
    });
    
    let form = [...document.getElementsByClassName('form-26zE04')].pop();

    form.lastChild.remove(); // Remove footer with button
    
    let content = form.firstChild.firstChild;
    
    content.firstChild.style.flex = 'unset'; // Stop title taking up all of contents
    
    content.lastChild.remove(); // Remove body
    
    let container = form.parentElement;
    container.style.maxHeight = 'none';
    // container.style.height = '70vh';
    
    let buttonsContainerEl = document.createElement('div');
    
    buttonsContainerEl.style.display = 'flex';
    buttonsContainerEl.style.flexDirection = 'column';
    buttonsContainerEl.style.justifyContent = 'center';
    buttonsContainerEl.style.flexGrow = '1';
    
    for (let p of options) {
      let el = document.createElement('div');
      el.style.margin = '20px';
      
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      
      let buttonEl = document.createElement('button');
      buttonEl.classList.add('primaryButton-2BsGPp', 'button-38aScr', 'lookFilled-1Gx00P', 'colorBrand-3pXr91', 'sizeXlarge-2yFAlZ', 'grow-q77ONN');
      
      buttonEl.onclick = () => {
        res(p);
      };

      if (p.onmouseenter) { 
        buttonEl.onmouseenter = () => {
          p.onmouseenter(container);
        };
      }

      if (p.onmouseleave) {
        buttonEl.onmouseleave = () => {
          p.onmouseleave(container);
        };
      }
      
      let contentsEl = document.createElement('div');
      contentsEl.classList.add('contents-18-Yxp');
      
      let displayName = p.text; //p.name[0].toUpperCase() + p.name.substring(1);
      
      contentsEl.textContent = displayName;
      
      buttonEl.appendChild(contentsEl);
      
      buttonEl.style.flex = 'unset';
      
      el.appendChild(buttonEl);
      
      let minorEl = document.createElement('div');
      minorEl.classList.add('minorContainer-Oi4S_y');
      
      minorEl.style.cursor = 'default';
      
      let minorTextEl = document.createElement('div');
      minorTextEl.classList.add('colorStandard-2KCXvj', 'size12-3cLvbJ');
      
      minorTextEl.style.textAlign = 'center';
      minorTextEl.style.opacity = '.6';
      
      minorTextEl.textContent = p.subtext; // `${packs[p].length} modules`; //packs[p].map((x) => goosemodScope.moduleStoreAPI.modules.find((y) => y.filename === x)).map((x) => x.name).join(', ');
      
      minorEl.appendChild(minorTextEl);
      
      el.appendChild(minorEl);
      
      buttonsContainerEl.appendChild(el);
    }
    
    content.appendChild(buttonsContainerEl);
  });
};

const installModules = async (modules) => {
  for (let m of modules) {
    goosemodScope.updateLoadingScreen(`${goosemodScope.moduleStoreAPI.modules.find((x) => x.name === m).name} - ${modules.indexOf(m) + 1}/${modules.length}`);

    await goosemodScope.moduleStoreAPI.importModule(m);
  }
};

export const ask = () => {
  return new Promise(async (res) => {
    goosemodScope.stopLoadingScreen();

    let packModules = (await selectionModal('Please pick a pack', packs)).modules;

    goosemodScope.startLoadingScreen();

    await installModules(packModules);

    let themesOptions = themes.map((x) => {
      let mod = goosemodScope.moduleStoreAPI.modules.find((y) => y.name === x);

      // let imported;

      return {
        text: mod.name.replace(' Theme', ''),
        subtext: mod.description,
        actual: x,
        onmouseenter: async function(container) {
          //if (!x.css) return;

          container.style.transition = 'opacity 1s';
          container.style.opacity = '0.2';

          let backdropEl = document.getElementsByClassName('backdrop-1wrmKB')[0];
          backdropEl.style.transition = 'opacity 1s';
          backdropEl.style.opacity = '0';

          await goosemodScope.moduleStoreAPI.importModule(mod.name);
        },
        onmouseleave: function(container) {
          container.style.opacity = '1';
          document.getElementsByClassName('backdrop-1wrmKB')[0].style.opacity = '0.85';

          if (!goosemodScope.modules[mod.name]) return;

          goosemodScope.settings.removeModuleUI(mod.name);
        }
      };
    });

    themesOptions.unshift({
      text: 'None',
      subtext: 'No additonal theming, stick with default Discord',
      actual: ''
    });

    goosemodScope.stopLoadingScreen();

    const theme = (await selectionModal('Please pick a theme', themesOptions)).actual;

    let themeEls = document.getElementsByClassName('gm-setup-theme');

    for (let e of themeEls) {
      e.remove();
    }

    goosemodScope.startLoadingScreen();

    if (theme) {
      await installModules([theme]);
    }

    return res(packModules);
  });
};