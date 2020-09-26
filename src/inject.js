window.goosemod = {};

(async function () {
  const sha512 = (str) => {
    return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf => {
      return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
    });
  };

  sha512(arguments.callee.toString()).then((hash) => {
    this.injectorHash = hash;
  });

  this.version = '2.0.1';

  this.modules = {};
  this.disabledModules = {};

  this.logger = {
    regionColors: {
      'import': 'rgb(100, 0, 0)'
    },

    debug: (region, ...args) => {
      let parentRegion = region.split('.')[0];
      console.log(`%cGooseMod%c %c${region}`, 'border: 1px solid white; padding: 2px; background-color: black; color: white', 'background-color: none', `border: 1px solid white; padding: 2px; background-color: ${this.logger.regionColors[parentRegion] || (this.modules[parentRegion] && this.modules[parentRegion].logRegionColor) || 'rgb(0, 0, 0)'}; color: white`, ...(args));
    }
  };
  
  if (window.gmUntethered) {
    this.untetheredVersion = window.gmUntethered.slice();

    // delete window.gmUntethered;
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Bypass to get Local Storage (Discord block / remove it) - Source / credit: https://stackoverflow.com/questions/52509440/discord-window-localstorage-is-undefined-how-to-get-access-to-the-localstorage
  function getLocalStoragePropertyDescriptor() {
    const iframe = document.createElement('iframe');
    document.head.append(iframe);
    const pd = Object.getOwnPropertyDescriptor(iframe.contentWindow, 'localStorage');
    iframe.remove();
    return pd;
  }

  try {
    Object.defineProperty(window, 'localStorage', getLocalStoragePropertyDescriptor());
  } catch (e) {
    console.error(e);
  }

  this.webpackModules = { // https://github.com/rauenzi/BetterDiscordApp/blob/master/src/modules/webpackModules.js
    req: undefined,

    init: () => {
      this.webpackModules.req = window.webpackJsonp.push([[], {__extra_id__: (module, exports, req) => module.exports = req}, [["__extra_id__"]]]);

      delete this.webpackModules.req.m.__extra_id__;
      delete this.webpackModules.req.c.__extra_id__;
    },
    
    find: (filter) => {
      for (const i in this.webpackModules.req.c) {
        if (this.webpackModules.req.c.hasOwnProperty(i)) {
            const m = this.webpackModules.req.c[i].exports;
            if (m && m.__esModule && m.default && filter(m.default)) return m.default;
            if (m && filter(m))	return m;
        }
      }

      // console.warn("Cannot find loaded module in cache");
      return null;
    },

    findAll: (filter) => {
      const modules = [];
      for (const i in this.webpackModules.req.c) {
          if (this.webpackModules.req.c.hasOwnProperty(i)) {
              const m = this.webpackModules.req.c[i].exports;
              if (m && m.__esModule && m.default && filter(m.default)) modules.push(m.default);
              else if (m && filter(m)) modules.push(m);
          }
      }
      return modules;
    },

    findByProps: (...propNames) => this.webpackModules.find(module => propNames.every(prop => module[prop] !== undefined)),
    findByPropsAll: (...propNames) => this.webpackModules.findAll(module => propNames.every(prop => module[prop] !== undefined)),

    findByPrototypes: (...protoNames) => this.webpackModules.find(module => module.prototype && protoNames.every(protoProp => module.prototype[protoProp] !== undefined)),

    findByDisplayName: (displayName) => this.webpackModules.find(module => module.displayName === displayName),
  };

  this.webpackModules.init();

  /* Toasts from BBD, slightly modified to fit CSS variables and tweaked to liking - full credit and sources:
  ** CSS: https://github.com/rauenzi/BetterDiscordApp/blob/master/src/styles/index.css
  ** JS: https://github.com/rauenzi/BetterDiscordApp/blob/master/src/modules/utils.js
  ** Again huge thanks to Rauenzi / (B)BD for basing some ideas and code (especially related to webpack modules)
  ** (Classes renamed to not interfere with (B)BD installed alongside)
  */

  const toastCSS = `.gm-toasts {
    position: fixed;
    display: flex;
    top: 0;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    pointer-events: none;
    z-index: 4000;
  }
  
  @keyframes gm-toast-up {
    from {
        transform: translateY(0);
        opacity: 0;
    }
  }
  
  .gm-toast {
    animation: gm-toast-up 300ms ease;
    transform: translateY(-10px);
    background: var(--background-floating);
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 0 1px rgba(32,34,37,.6), 0 2px 10px 0 rgba(0,0,0,.2);
    font-weight: 500;
    color: #fff;
    user-select: text;
    font-size: 14px;
    opacity: 1;
    margin-top: 10px;
    pointer-events: none;
    user-select: none;
  }
  
  @keyframes gm-toast-down {
    to {
        transform: translateY(0px);
        opacity: 0;
    }
  }
  
  .gm-toast.closing {
    animation: gm-toast-down 200ms ease;
    animation-fill-mode: forwards;
    opacity: 1;
    transform: translateY(-10px);
  }
  
  
  .gm-toast.icon {
    padding-left: 30px;
    background-size: 20px 20px;
    background-repeat: no-repeat;
    background-position: 6px 50%;
  }
  
  .gm-toast.toast-info {
    background-color: #4a90e2;
  }
  
  .gm-toast.toast-info.icon {
    background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMSAxNWgtMnYtNmgydjZ6bTAtOGgtMlY3aDJ2MnoiLz48L3N2Zz4=);
  }
  
  .gm-toast.toast-success {
    background-color: #43b581;
  }
  
  .gm-toast.toast-success.icon {
    background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTVsLTUtNSAxLjQxLTEuNDFMMTAgMTQuMTdsNy41OS03LjU5TDE5IDhsLTkgOXoiLz48L3N2Zz4=);
  }

  .gm-toast.toast-danger,
  .gm-toast.toast-error {
    background-color: #f04747;
  }
  
  .gm-toast.toast-danger.icon,
  .gm-toast.toast-error.icon {
    background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTEyIDJDNi40NyAyIDIgNi40NyAyIDEyczQuNDcgMTAgMTAgMTAgMTAtNC40NyAxMC0xMFMxNy41MyAyIDEyIDJ6bTUgMTMuNTlMMTUuNTkgMTcgMTIgMTMuNDEgOC40MSAxNyA3IDE1LjU5IDEwLjU5IDEyIDcgOC40MSA4LjQxIDcgMTIgMTAuNTkgMTUuNTkgNyAxNyA4LjQxIDEzLjQxIDEyIDE3IDE1LjU5eiIvPiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PC9zdmc+);
  }
  
  .gm-toast.toast-warning,
  .gm-toast.toast-warn {
    background-color: #FFA600;
    color: white;
  }
  
  .gm-toast.toast-warning.icon,
  .gm-toast.toast-warn.icon {
    background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNMSAyMWgyMkwxMiAyIDEgMjF6bTEyLTNoLTJ2LTJoMnYyem0wLTRoLTJ2LTRoMnY0eiIvPjwvc3ZnPg==);
  }`;

  const styleSheet = document.createElement('style'); // Add CSS as stylesheet
  styleSheet.textContent = toastCSS;
  document.head.appendChild(styleSheet);

  this.showToast = (text, options = {}) => {
    if (!document.querySelector('.gm-toasts')) {
      const container = document.querySelector('.sidebar-2K8pFh + div') || null;

      const memberlist = container ? container.querySelector('.membersWrap-2h-GB4') : null;

      const form = container ? container.querySelector('form') : null;

      const left = container ? container.getBoundingClientRect().left : 310;
      const right = memberlist ? memberlist.getBoundingClientRect().left : 0;
      const width = right ? right - container.getBoundingClientRect().left : window.innerWidth - left - 240;
      const bottom = form ? form.offsetHeight : 80;

      const toastWrapper = document.createElement('div');

      toastWrapper.classList.add('gm-toasts');

      toastWrapper.style.setProperty('left', left + 'px');
      toastWrapper.style.setProperty('width', width + 'px');
      toastWrapper.style.setProperty('bottom', bottom + 'px');

      document.querySelector('#app-mount').appendChild(toastWrapper);
    }

    const {type = '', icon = true, timeout = 3000} = options;

    const toastElem = document.createElement('div');
    toastElem.classList.add('gm-toast');

    if (type) toastElem.classList.add('toast-' + type);
    if (type && icon) toastElem.classList.add('icon');

    toastElem.textContent = text;

    document.querySelector('.gm-toasts').appendChild(toastElem);

    setTimeout(() => {
        toastElem.classList.add('closing');
        setTimeout(() => {
            toastElem.remove();
            if (!document.querySelectorAll('.gm-toasts .gm-toast').length) document.querySelector('.gm-toasts').remove();
        }, 300);
    }, timeout);
  };

  this.messageEasterEggs = {
    eggs: [
      {
        text: 'Goose Emoji',
        message: 'Did you know there is no goose emoji? The most used one as a standin is a swan (\u{1F9A2}). Very sad.'
      },
      {
        text: 'That\'s Numberwang!',
        message: 'That\'s Wangernum!'
      },
      {
        text: 'When does Atmosphere come out?',
        message: 'June 15th!'
      },
      {
        text: 'What is the meaning of life?',
        message: '42, duh.'
      },
      {
        text: 'Honk',
        message: 'Honk'
      },
      {
        text: 'GooseMod',
        message: 'You talking about me? ;)'
      }
    ],

    interval: 0,

    check: () => {
      let el = document.getElementsByClassName('slateTextArea-1Mkdgw')[0];

      if (!el) return;

      for (let e of this.messageEasterEggs.eggs) {
        if (el.textContent === e.text) {
          if (e.cooldown) {
            e.cooldown -= 1;
            continue;
          }

          this.showToast(e.message);

          e.cooldown = (e.cooldown || 6) - 1;
        }
      }
    }
  };

  window.messageEasterEggs = this.messageEasterEggs;

  this.messageEasterEggs.interval = setInterval(this.messageEasterEggs.check, 1000);

  this.removeModuleUI = (field, where) => {
    let settingItem = this.settings.items.find((x) => x[1] === 'Manage Modules');

    settingItem[2].splice(settingItem[2].indexOf(settingItem[2].find((x) => x.subtext === this.modules[field].description)), 1);

    this.moduleStoreAPI.moduleRemoved(this.modules[field]);

    this.modules[field].remove();

    delete this.modules[field];

    this.clearModuleSetting(field);

    this.settings.createFromItems();
    this.openSettingItem(where);
  };

  this.isSettingsOpen = () => {
    return document.querySelector('div[aria-label="USER_SETTINGS"] div[aria-label="Close"]') !== null;
  };

  this.closeSettings = () => {
    let closeEl = document.querySelector('div[aria-label="USER_SETTINGS"] div[aria-label="Close"]');
    
    if (closeEl === null) return false;
    
    closeEl.click(); // Close settings via clicking the close settings button
  };

  this.openSettings = () => {
    settingsButtonEl.click();
  };

  this.openSettingItem = (name) => {
    [...settingsSidebarGooseModContainer.children].find((x) => x.textContent === name).click();
  };

  this.startLoadingScreen = async () => {
    this.closeSettings();

    let html = `<div id="gm-loading-container" class="container-16j22k fixClipping-3qAKRb" style="opacity: 1;"><div class="content-1-zrf2"> <video class="ready-36e6Vk" autoplay="" playsinline="" loop=""> <source src="/assets/0bdc0497eb3a19e66f2b1e3d5741634c.webm" type="video/webm"> <source src="/assets/ffac5bb3fb919ce8bf7137d79e9defc9.mp4" type="video/mp4"> <img alt="" src="/assets/5ccabf62108d5a8074ddd95af2211727.png"> </video><div class="text-3c9Zq1"><div class="tipTitle-GL9qAt">Injecting GooseMod</div><div class="tip-2cgoli" id="gm-loading-tip">Injecting</div><div class="body-2Vra9D contentBase-11jeVK"></div></div></div><div style="transform: translate3d(0,0%,0);" class="problems-3mgf6w"><div class="problemsText-1Yx-Kl">Like GooseMod? Let us know!</div><div> <a class="anchor-3Z-8Bb anchorUnderlineOnHover-2ESHQB twitterLink-3NsWMp links-3Ldd4A" href="https://twitter.com/Goose_Mod" rel="noreferrer noopener" target="_blank"> <svg class="icon-3N9Bhy" width="20" height="16" viewBox="0 0 20 16" aria-hidden="false"> <g fill="none" fill-rule="evenodd"> <path fill="currentColor" d="M1,14.1538462 L1.95,14.1538462 C3.73125,14.1538462 5.5125,13.5384615 6.81875,12.4307692 C5.15625,12.4307692 3.73125,11.2 3.1375,9.6 C3.375,9.6 3.6125,9.72307692 3.85,9.72307692 C4.20625,9.72307692 4.5625,9.72307692 4.91875,9.6 C3.1375,9.23076923 1.7125,7.63076923 1.7125,5.66153846 C2.1875,5.90769231 2.78125,6.15384615 3.49375,6.15384615 C2.425,5.41538462 1.83125,4.18461538 1.83125,2.70769231 C1.83125,1.96923077 2.06875,1.23076923 2.30625,0.615384615 C4.20625,3.07692308 7.05625,4.67692308 10.38125,4.8 C10.2625,4.67692308 10.2625,4.30769231 10.2625,4.06153846 C10.2625,1.84615385 12.04375,0 14.18125,0 C15.25,0 16.31875,0.492307692 17.03125,1.23076923 C17.8625,1.10769231 18.8125,0.738461538 19.525,0.246153846 C19.2875,1.23076923 18.575,1.96923077 17.8625,2.46153846 C18.575,2.46153846 19.2875,2.21538462 20,1.84615385 C19.525,2.70769231 18.8125,3.32307692 18.1,3.93846154 L18.1,4.43076923 C18.1,9.84615385 14.18125,16 6.9375,16 C4.68125,16 2.6625,15.3846154 1,14.1538462 Z"></path> <rect width="20" height="16"></rect> </g> </svg> Tweet Us </a> <a class="anchor-3Z-8Bb anchorUnderlineOnHover-2ESHQB statusLink-gFXhrL links-3Ldd4A" href="https://github.com/GooseMod" rel="noreferrer noopener" target="_blank"> <svg class="icon-3N9Bhy" aria-hidden="false" width="14" height="14" viewBox="0 0 14 14"> <path fill="currentColor" d="M6.99471698,9.67522659 C8.47108874,9.67522659 9.66792453,8.47748685 9.66792453,7 C9.66792453,5.52251315 8.47108874,4.32477341 6.99471698,4.32477341 C5.51834522,4.32477341 4.32150943,5.52251315 4.32150943,7 C4.32150943,8.47748685 5.51834522,9.67522659 6.99471698,9.67522659 Z M6.99471698,2.67522659 C8.18867925,2.67522659 9.26641509,3.16163142 10.0483019,3.94410876 L11.9396226,2.05135952 C10.6822642,0.782477341 8.92830189,0 6.99471698,0 C3.12754717,0 0,3.14048338 0,7 L2.67320755,7 C2.67320755,4.6102719 4.60679245,2.67522659 6.99471698,2.67522659 Z M11.3267925,7 C11.3267925,9.3897281 9.39320755,11.3247734 7.00528302,11.3247734 C5.81132075,11.3247734 4.73358491,10.8383686 3.94113208,10.0558912 L2.04981132,11.9486405 C3.31773585,13.2175227 5.06113208,14 6.99471698,14 C10.8618868,14 14,10.8595166 14,7 L11.3267925,7 Z"></path> </svg> GitHub Repositories </a></div></div></div>`;

    let el = document.createElement('div');

    document.body.appendChild(el);

    el.outerHTML = html;

    let el2 = document.getElementById('gm-loading-container');
    
    el2.style.transition = 'background-color 0.5s';

    await sleep(10);

    el2.style.backgroundColor = '#050505';
  };

  this.updateLoadingScreen = async (tip) => {
    let el = document.getElementById('gm-loading-tip');

    if (el === null) return;

    el.innerHTML = tip;
  };

  this.stopLoadingScreen = async () => {
    let el = document.getElementById('gm-loading-container');

    if (el === null) return false;

    el.remove();
  };

  this.startLoadingScreen();

  this.updateLoadingScreen('Starting...');

  const awaitIframe = (iframe) => {
    return new Promise((res) => {
      iframe.addEventListener("load", function() {
        res();
      });
    })
  };

  const reopenSettings = async () => {
    if (!this.stopLoadingScreen()) {
      this.closeSettings();

      await sleep(1000);
    }

    this.openSettings();

    await sleep(200);

    this.openSettingItem('Module Store');
  };

  this.cspBypasser = {
    frame: document.createElement('iframe'),

    init: async () => {
      this.cspBypasser.frame.src = `${location.origin}/api/gateway`;
      document.body.appendChild(this.cspBypasser.frame);

      await awaitIframe(this.cspBypasser.frame);

      let script = document.createElement('script');
      script.type = 'text/javascript';

      let code = `
      window.addEventListener('message', async (e) => {
        const {url, type, useCORSProxy} = e.data;

        const proxyURL = useCORSProxy ? \`https://cors-anywhere.herokuapp.com/\${url}\` : url;

        if (type === 'img') {
          let canvas = document.createElement('canvas');
          let ctx = canvas.getContext('2d');

          let img = new Image();
          img.src = proxyURL;
          img.crossOrigin = 'anonymous';

          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            e.source.postMessage(canvas.toDataURL("image/png"));
          };

          return;
        }       
        
        const req = await fetch(proxyURL, {
          cache: 'no-store'
        });

        e.source.postMessage(type === 'json' ? await req.json() : (type === 'text' ? await req.text() : await req.blob()));
      }, false);`;

      script.appendChild(document.createTextNode(code));

      this.cspBypasser.frame.contentDocument.head.appendChild(script);
    },

    runCode: (code) => {
      let script = document.createElement('script');
      script.type = 'text/javascript';

      script.appendChild(document.createTextNode(code));

      this.cspBypasser.frame.contentDocument.head.appendChild(script);
    },

    json: (url, useCORSProxy = true) => {
      return new Promise((res) => {
        this.cspBypasser.frame.contentWindow.postMessage({url, type: 'json', useCORSProxy});

        window.addEventListener('message', async (e) => {
          res(e.data);
        }, false);
      });
    },

    text: (url, useCORSProxy = true) => {
      return new Promise((res) => {
        this.cspBypasser.frame.contentWindow.postMessage({url, type: 'text', useCORSProxy});

        window.addEventListener('message', async (e) => {
          res(e.data);
        }, false);
      });
    },

    blob: (url, useCORSProxy = true) => {
      return new Promise((res) => {
        this.cspBypasser.frame.contentWindow.postMessage({url, type: 'blob', useCORSProxy});

        window.addEventListener('message', async (e) => {
          res(e.data);
        }, false);
      });
    },

    image: (url, useCORSProxy = true) => {
      return new Promise((res) => {
        this.cspBypasser.frame.contentWindow.postMessage({url, type: 'img', useCORSProxy});

        window.addEventListener('message', async (e) => {
          res(e.data);
        }, false);
      });
    },
  };

  this.updateLoadingScreen('Initialising CSP Bypasser...');

  await this.cspBypasser.init();

  this.moduleStoreAPI = {
    modules: [],

    apiBaseURL: 'https://goosemod-api.netlify.app',

    updateModules: async () => {
      this.moduleStoreAPI.modules = (await this.cspBypasser.json(`${this.moduleStoreAPI.apiBaseURL}/modules.json`, false)).sort((a, b) => a.name.localeCompare(b.name));
    },

    importModule: async (moduleName) => {
      const moduleInfo = this.moduleStoreAPI.modules.find((x) => x.filename === moduleName);

      const jsCode = await this.cspBypasser.text(moduleInfo.codeURL, false);

      await this.importModule({
        filename: `${moduleInfo.filename}.js`,
        data: jsCode
      });

      if (this.modules[moduleInfo.filename].onLoadingFinished !== undefined) {
        await this.modules[moduleInfo.filename].onLoadingFinished();
      }

      let settingItem = this.settings.items.find((x) => x[1] === 'Module Store');

      let item = settingItem[2].find((x) => x.subtext === moduleInfo.description);

      item.type = 'toggle-text-danger-button';
      item.buttonText = 'Remove';

      if (this.isSettingsOpen()) this.settings.createFromItems();
    },

    moduleRemoved: async (m) => {
      let item = this.settings.items.find((x) => x[1] === 'Module Store')[2].find((x) => x.subtext === m.description);
      
      if (item === undefined) return;

      item.type = 'text-and-button';
      item.buttonText = 'Import';
    },

    updateStoreSetting: () => {
      let item = this.settings.items.find((x) => x[1] === 'Module Store');

      item[2] = item[2].slice(0, 2);

      let sortedCategories = this.moduleStoreAPI.modules.reduce((cats, o) => cats.includes(o.category) ? cats : cats.concat(o.category), []).sort((a, b) => a.localeCompare(b));

      let arr = Object.entries(this.moduleStoreAPI.modules.reduce((cats, o) => {
        if (!cats[o.category]) cats[o.category]=[];
        cats[o.category].push(o);
        return cats;
      },{})).sort((a, b) => a[0].localeCompare(b[0])).map(o => o[1]);

      let funIndex = sortedCategories.indexOf('fun');

      sortedCategories.push(sortedCategories.splice(funIndex, 1)[0]);
      arr.push(arr.splice(funIndex, 1)[0]);

      for (let i = 0; i < arr.length; i++) {
        item[2].push({
          type: 'header',
          text: sortedCategories[i].replace(/\-/g, ' ')
        });

        for (let m of arr[i]) {
          item[2].push({
            type: this.modules[m.filename] ? 'toggle-text-danger-button' : 'text-and-button',
            text: `${m.name} <span class="description-3_Ncsb">by</span> ${m.author} <span class="description-3_Ncsb">(v${m.version})</span>`,
            buttonText: this.modules[m.filename] ? 'Remove' : 'Import',
            subtext: m.description,
            onclick: async (el) => {
              if (this.modules[m.filename]) {
                el.textContent = 'Removing...';

                this.removeModuleUI(m.filename, 'Module Store');

                return;
              }

              el.textContent = 'Importing...';

              await this.moduleStoreAPI.importModule(m.filename);

              this.settings.createFromItems();
              this.openSettingItem('Module Store');
            },
            isToggled: () => this.modules[m.filename] !== undefined,
            onToggle: async (checked) => {
              if (checked) {
                this.modules[m.filename] = Object.assign({}, this.disabledModules[m.filename]);
                delete this.disabledModules[m.filename];

                //this.modules[]
                //this.removeModuleUI(m.filename, 'Module Store');

                //delete this.modules[m.filename].disabled;

                await this.modules[m.filename].onImport();

                await this.modules[m.filename].onLoadingFinished();

                this.loadSavedModuleSetting(m.filename);
              } else {
                //this.modules[m.filename].disabled = true;

                //this.modules[m.filename].remove();

                this.disabledModules[m.filename] = Object.assign({}, this.modules[m.filename]);

                //this.removeModuleUI(m.filename, 'Module Store');

                //let settingItem = this.settings.items.find((x) => x[1] === 'Manage Modules');

                //settingItem[2].splice(settingItem[2].indexOf(settingItem[2].find((x) => x.subtext === this.modules[field].description)), 1);

                //this.moduleStoreAPI.moduleRemoved(this.modules[field]);

                this.modules[m.filename].remove();

                delete this.modules[m.filename];

                this.settings.createFromItems();
                this.openSettingItem('Module Store');
              }

              this.settings.createFromItems();
              this.openSettingItem('Module Store');
            }
          });
        }
      }
    }
  };

  this.updateLoadingScreen('Getting modules from Module Store...');

  await this.moduleStoreAPI.updateModules();

  this.updateLoadingScreen('Initialising UI functions...');

  this.logger.debug('import.version.goosemod', `${this.version} (${this.injectorHash})`);

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
      settingsSidebarGooseModContainer.innerHTML = '';

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

          case 'button':
            el = document.createElement('button');

            el.classList.add('button-38aScr', 'lookFilled-1Gx00P', 'colorBrand-3pXr91', 'sizeSmall-2cSMqn', 'grow-q77ONN');

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

            toggleEl.style.float = 'left';
            toggleEl.style.marginRight = '8px';

            el.appendChild(toggleEl);

            let txtEl = document.createElement('span');
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

            toggleEl.style.float = 'left';
            toggleEl.style.marginRight = '8px';

            el.appendChild(toggleEl);

            let txtEl = document.createElement('span');
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

      if (panelName === 'Manage Modules' && window.DiscordNative === undefined) return;

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

    versionEl.textContent = `GooseMod ${this.version} (${this.injectorHash.substring(0, 7)})`;

    settingsSidebarEl.lastChild.appendChild(versionEl);

    let versionElUntethered = document.createElement('div');
    versionElUntethered.classList.add('colorMuted-HdFt4q', 'size12-3cLvbJ');

    versionElUntethered.textContent = `GooseMod Untethered ${this.untetheredVersion || 'N/A'}`;

    settingsSidebarEl.lastChild.appendChild(versionElUntethered);

    settingsMainEl = settingsLayerEl.querySelector('main');

    this.settings.createFromItems();
  });

  this.updateLoadingScreen('Initialising import functions...');

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
        el.textContent = 'Removing...';

        this.removeModuleUI(field, 'Manage Modules');
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

  this.updateLoadingScreen('Creating settings options...');

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

        this.settings.createFromItems();
        this.openSettingItem('Manage Modules');
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

        this.settings.createFromItems();

        this.openSettingItem('Module Store');
      },
    }
  ]);

  this.settings.createSeparator();

  this.settings.createItem('Uninstall', [""], async () => {
    if (await this.confirmDialog('Uninstall', 'Uninstall GooseMod', 'Are you sure you want to uninstall GooseMod? This is a quick uninstall, it may leave some code behind but there should be no remaining noticable changes.')) {
      this.closeSettings();

      this.remove();
    }
  }, true);

  if (window.DiscordNative !== undefined) {
    this.settings.createItem('Local Reinstall', [''], async () => {
      if (await this.confirmDialog('Reinstall', 'Reinstall GooseMod', 'Are you sure you want to reinstall GooseMod? This will uninstall GooseMod, then ask you for the inject.js file, then run it to reinstall.')) {
        this.closeSettings();

        this.remove();

        eval(ab2str((await DiscordNative.fileManager.openFiles())[0].data));
      }
    }, true);
  }

  this.settings.createSeparator();

  this.settings.createHeading('GooseMod Modules');

  this.remove = () => {
    clearInterval(this.messageEasterEggs.interval);
    clearInterval(this.saveInterval);

    this.clearSettings();

    this.removed = true;

    for (let p in this.modules) {
      if (this.modules.hasOwnProperty(p) && this.modules[p].remove !== undefined) {
        this.modules[p].remove();
      }
    }
  };

  this.saveModuleSettings = async () => {
    //this.logger.debug('settings', 'Saving module settings...');

    let settings = JSON.parse(localStorage.getItem('goosemodModules')) || {};

    for (let p in this.modules) {
      if (this.modules.hasOwnProperty(p)) {
        settings[p] = await (this.modules[p].getSettings || (async () => []))();
      }
    }

    if (JSON.stringify(JSON.parse(localStorage.getItem('goosemodModules'))) !== JSON.stringify(settings)) {
      localStorage.setItem('goosemodModules', JSON.stringify(settings));

      this.showToast('Settings saved');
    }

    //console.log(settings);
  };

  this.clearModuleSetting = (moduleName) => {
    let settings = JSON.parse(localStorage.getItem('goosemodModules'));

    delete settings[moduleName];

    localStorage.setItem('goosemodModules', JSON.stringify(settings));
  };

  this.clearSettings = () => {
    localStorage.removeItem('goosemodModules');
  };

  this.loadSavedModuleSetting = async (moduleName) => {
    let settings = JSON.parse(localStorage.getItem('goosemodModules'));

    await (this.modules[moduleName].loadSettings || (async () => []))(settings[moduleName]);
  };

  this.loadSavedModuleSettings = async () => {
    //this.logger.debug('settings', 'Loading module settings...');

    let settings = JSON.parse(localStorage.getItem('goosemodModules'));

    console.log(settings);

    if (!settings) return;

    for (let p in this.modules) {
      if (this.modules.hasOwnProperty(p) && settings.hasOwnProperty(p)) {
        console.log(p, this.modules[p].loadSettings, settings[p]);
        await (this.modules[p].loadSettings || (async () => []))(settings[p]);
      }
    }

    return settings;
  };

  this.updateLoadingScreen('Updating Module Store setting page...');

  this.moduleStoreAPI.updateStoreSetting();

  let toInstallModules = Object.keys(JSON.parse(localStorage.getItem('goosemodModules')) || {});
  let toInstallIsDefault = false;

  if (toInstallModules.length === 0) {
    toInstallIsDefault = true;
    toInstallModules = ['fucklytics', 'visualTweaks', 'wysiwygMessages', 'customSounds', 'devMode', 'twitchEmotes', 'noMessageDeletion'];
  }

  for (let m of toInstallModules) {
    this.updateLoadingScreen(`Importing default modules from Module Store...<br><br>${this.moduleStoreAPI.modules.find((x) => x.filename === m).name}<br>${toInstallModules.indexOf(m) + 1}/${toInstallModules.length}<br>${toInstallIsDefault ? '(Default)' : '(Last Installed)'}`);

    await this.moduleStoreAPI.importModule(m);
  }

  await this.loadSavedModuleSettings();

  reopenSettings();

  this.saveInterval = setInterval(this.saveModuleSettings, 3000);
}).bind(window.goosemod)();