import * as GoosemodChangelog from '../goosemodChangelog';

export default (goosemodScope, gmSettings, Items) => {
  let oldItems = goosemodScope.settings.items;
  goosemodScope.settings.items = [];

  goosemodScope.settings.createHeading('GooseMod');

  const changeSetting = async (key, value) => {
    switch (key) {
      case 'changelog': {
        if (value) {
          const items = [
            ['item', goosemodScope.i18n.discordStrings.CHANGE_LOG, [''], async () => {
              GoosemodChangelog.show();
            }, false]
          ];

          if (gmSettings.get().separators) items.unshift(['separator']);

          goosemodScope.settings.items.splice(goosemodScope.settings.items.indexOf(goosemodScope.settings.items.find(x => x[1] === 'Themes')) + 1, 0,
            ...items
          );
        } else {
          goosemodScope.settings.items.splice(goosemodScope.settings.items.indexOf(goosemodScope.settings.items.find(x => x[1] === 'Change Log')), gmSettings.get().separators ? 2 : 1);
        }

        await goosemodScope.settings.reopenSettings();
        goosemodScope.settings.openSettingItem('Settings');

        break;
      }

      case 'devchannel': {
        if (value) {
          goosemod.storage.set('goosemodUntetheredBranch', 'dev');
        } else {
          goosemod.storage.remove('goosemodUntetheredBranch');
        }

        break;
      }

      case 'separators': {
        if (value) {
          if (!gmSettings.get().home) goosemod.settings.items.splice(2, 0, ['separator']);
          if (gmSettings.get().changelog) goosemod.settings.items.splice(4, 0, ['separator']);
        } else {
          let main = true;

          goosemodScope.settings.items = goosemodScope.settings.items.filter((x, i) => {
            if (goosemodScope.settings.items[i + 1] && goosemodScope.settings.items[i + 1][1] && goosemodScope.settings.items[i + 1][1] === 'GooseMod Modules') main = false;

            return !(x[0] === 'separator' && main);
          });
        }

        await goosemodScope.settings.reopenSettings();
        goosemodScope.settings.openSettingItem('Settings');

        break;
      }

      case 'gmBadges': {
        goosemodScope.gmBadges[value ? 'addBadges' : 'removeBadges']();

        break;
      }
    }

    gmSettings.set(key, value);
  };

  const refreshPrompt = async () => {
    if (await goosemodScope.confirmDialog('Refresh', 'Refresh Required', 'This setting **requires a refresh to take effect**. You **may experience some strange behaviour** in this session before refreshing.')) {
      location.reload();
    }
  };

  let settingDebugShowing = false;

  goosemodScope.settings.createItem(goosemodScope.i18n.discordStrings.SETTINGS, ['',
    {
      type: 'header',
      text: 'Settings'
    },

    {
      type: 'toggle',

      text: 'GooseMod Change Log',
      subtext: 'Show GooseMod "Change Log" setting',

      onToggle: (c) => changeSetting('changelog', c),
      isToggled: () => gmSettings.get().changelog
    },

    {
      type: 'toggle',

      text: 'Main Separators',
      subtext: 'Show separators between main GooseMod settings',

      onToggle: (c) => changeSetting('separators', c),
      isToggled: () => gmSettings.get().separators
    },

    {
      type: 'toggle',

      text: 'Store In Home',
      subtext: 'Put GooseMod Store options in home instead of in settings',

      onToggle: (c) => {
        changeSetting('home', c);
        refreshPrompt();
      },
      isToggled: () => gmSettings.get().home
    },

    {
      type: 'header',
      text: 'Store'
    },

    {
      type: 'toggle',

      text: 'Auto Update',
      subtext: 'Automatically update repos and modules every hour',

      onToggle: (c) => changeSetting('autoupdate', c),
      isToggled: () => gmSettings.get().autoupdate
    },

    {
      type: 'header',
      text: 'Appearance'
    },

    {
      type: 'toggle',

      text: 'GooseMod Badges',
      subtext: 'Shows GooseMod\'s badges',

      onToggle: (c) => changeSetting('gmBadges', c),
      isToggled: () => gmSettings.get().gmBadges
    },

    {
      type: 'header',
      text: 'Utilities'
    },

    {
      type: 'text-and-button',

      text: 'Purge Caches',
      subtext: 'Purges (completely removes) most caches GooseMod uses',
      buttonText: 'Purge',

      onclick: async () => {
        // Like remove's dynamic local storage removal, but only remove GooseMod keys with "Cache" in 
        goosemod.storage.keys().filter((x) => x.toLowerCase().startsWith('goosemod') && x.includes('Cache')).forEach((x) => goosemod.storage.remove(x));

        refreshPrompt();
      }
    },

    {
      type: 'text-and-button',

      text: 'Start Tour',
      subtext: 'Go through GooseMod\'s startup tour again',
      buttonText: 'Tour',

      onclick: async () => {
        goosemodScope.ootb.start();
      }
    },

    {
      type: 'text-and-button',

      text: 'Copy Debug Info',
      subtext: 'Copies information on setup and GooseMod for reporting and debugging',
      buttonText: 'Copy',

      onclick: async () => {
        const { copy } = goosemodScope.webpackModules.findByProps('copy', 'SUPPORTS_COPY');

        const mods = {
          powercord: 'powercord',
          vizality: 'vizality',
          ED: 'enhanceddiscord',
          BdApi: 'betterdiscord'
        };

        copy(`Discord:
Client: ${window.DiscordNative ? 'desktop' : 'web'}
User Agent: ${navigator.userAgent}
Release Channel: ${GLOBAL_ENV.RELEASE_CHANNEL}
Other Mods: ${Object.keys(mods).filter((x) => Object.keys(window).includes(x)).map((x) => mods[x]).join(', ')}

GooseMod:
GM Version: ${goosemodScope.versioning.version} (${goosemodScope.versioning.hash})
GM Branch: ${goosemodScope.storage.get('goosemodUntetheredBranch')}
GM Extension Version: ${gmExtension}
Modules: ${Object.keys(goosemodScope.modules).join(', ')}
`);
      }
    },

    {
      type: 'text-and-danger-button',
      
      text: 'Reset GooseMod',
      subtext: 'Resets GooseMod completely: removes all preferences and modules; like a first-time install',
      buttonText: 'Reset',

      onclick: async () => {
        if (await goosemodScope.confirmDialog('Reset', 'Reset GooseMod', 'Confirming will completely reset GooseMod, removing all preferences and modules; as if you had installed GooseMod for the first time. This is irreversible.')) {
          goosemodScope.remove();
          window.location.reload();
        }
      }
    },

    {
      type: 'header',
      text: 'Backup'
    },

    {
      type: 'text-and-button',

      text: 'Create Backup',
      subtext: 'Creates a file for backup of your GooseMod modules and settings',
      buttonText: 'Backup',

      onclick: () => {
        const obj = goosemod.storage.keys().filter((x) => x.toLowerCase().startsWith('goosemod') && !x.includes('Cache')).reduce((acc, k) => {
          acc[k] = goosemod.storage.get(k);
          return acc;
        }, {});

        const toSave = JSON.stringify(obj);

        const el = document.createElement("a");
        el.style.display = 'none';

        const file = new Blob([ toSave ], { type: 'application/json' });

        el.href = URL.createObjectURL(file);
        el.download = `goosemodBackup.json`;

        document.body.appendChild(el);

        el.click();

        el.remove();
      }
    },

    {
      type: 'text-and-button',

      text: 'Restore Backup',
      subtext: 'Restore your GooseMod modules and settings via a backup file, **only restore backups you trust**',
      buttonText: 'Restore',

      onclick: async () => {
        const el = document.createElement('input');
        el.style.display = 'none';
        el.type = 'file';

        el.click();

        await new Promise((res) => { el.onchange = () => { res(); }; });
        
        const file = el.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
          const obj = JSON.parse(reader.result);

          for (const k in obj) {
            if (!k.startsWith('goosemod')) continue; // Don't set if not goosemod key for some security

            goosemod.storage.set(k, obj[k]);
          }

          location.reload();
        };

        reader.readAsText(file);
      }
    },

    {
      type: 'header',
      text: 'Experimental',
      // experimental: true
    },

    {
      type: 'subtext',
      text: 'Experimental settings are likely incomplete and unstable, which may result in a reduced experience'
    },

    {
      type: 'toggle',

      experimental: true,
      text: 'Development Channel',
      subtext: 'Use experimental development GooseMod builds',

      onToggle: (c) => {
        changeSetting('devchannel', c);
        refreshPrompt();
      },
      isToggled: () => goosemod.storage.get('goosemodUntetheredBranch') === 'dev'
    },

    {
      type: 'toggle',

      experimental: true,
      text: 'Data Attributes',
      subtext: 'Add data attributes to some elements for some themes to use',

      onToggle: (c) => {
        changeSetting('attrs', c);
        refreshPrompt();
      },
      isToggled: () => gmSettings.get().attrs
    },

    {
      type: 'toggle',

      experimental: true,
      text: 'Snippets',
      subtext: 'Enable Snippets tab in Store',

      onToggle: (c) => {
        changeSetting('snippets', c);
        refreshPrompt();
      },
      isToggled: () => gmSettings.get().snippets
    },

    {
      type: 'toggle',

      experimental: true,
      text: 'Force Theme Settings',
      subtext: 'Force auto-generated settings for all themes',

      onToggle: (c) => {
        changeSetting('allThemeSettings', c);
        refreshPrompt();
      },
      isToggled: () => gmSettings.get().allThemeSettings
    },

    /* {
      type: 'header',
      text: 'Debug',
      experimental: true
    },

    {
      type: 'toggle',

      debug: true,
      text: 'Add Debug Setting',
      subtext: 'Shows debug setting to test settings (per session, refresh to remove)',

      onToggle: () => {
        settingDebugShowing = true;

        goosemodScope.settings.createItem('Debug', ['',
          ...Object.keys(Items).filter((x) => x !== 'card').map((x) => ({
            type: x,

            text: x,
            label: x,

            subtext: 'subtext',

            buttonText: 'button text',
            placeholder: 'placeholder',

            initialValue: () => 'value',
            options: ['option 1', 'option 2', 'option 3'],
            isToggled: () => true,

            sort: () => 0,

            element: () => {
              const el = document.createElement('div');
              el.textContent = 'element text content';
              return el;
            }
          }))
        ]);
      },
      isToggled: () => settingDebugShowing,
      disabled: () => settingDebugShowing
    },

    {
      type: 'toggle',

      debug: true,
      text: 'Show Debug Toasts',
      subtext: 'Shows some debug toasts on some events',

      onToggle: (c) => changeSetting('debugToasts', c),
      isToggled: () => gmSettings.get().debugToasts
    }, */

    { type: 'gm-footer' }
  ]);

  if (gmSettings.get().separators && !gmSettings.get().home) goosemodScope.settings.createSeparator();

  let sortedVal = 'Stars';
  let authorVal = 'All';
  let searchQuery = '';

  const updateModuleStoreUI = () => {
    const cards = document.getElementsByClassName('gm-store-card');

    const fuzzyReg = new RegExp(`.*${searchQuery}.*`, 'i');

    const importedVal = document.querySelector('.selected-3s45Ha').textContent;

    for (let c of cards) {
      const titles = c.getElementsByClassName('title-31JmR4');

      const title = titles[1];

      const authors = [...titles[0].getElementsByClassName('author')].map((x) => x.textContent.split('#')[0]);
      const name = title.childNodes[0].wholeText;

      const description = c.getElementsByClassName('description-3_Ncsb')[0].innerText;

      const matches = (fuzzyReg.test(name) || fuzzyReg.test(description));

      const importedSelector = !c.getElementsByClassName('container-3auIfb')[0].classList.contains('hide-toggle') ? 'Imported' : 'Store';

      // const tags = [...c.classList].map((t) => t.replace(/\|/g, ' ').toLowerCase());

      switch (sortedVal) {
        case 'A-Z': { // Already pre-sorted to A-Z
          c.style.order = '';

          break;
        }

        case 'Last Updated': {
          const module = goosemodScope.moduleStoreAPI.modules.find((x) => x.name === name.trim());

          c.style.order = 3000000000 - module.lastUpdated;

          break;
        }

        case 'Stars': {
          c.style.order = 10000 - parseInt(c.children[4].children[0].children[0].textContent);

          break;
        }
      }

      c.style.display = matches
        && (importedVal === 'Store' || importedVal === importedSelector)
        && (authorVal === 'All' || authors.includes(authorVal.split(' (').slice(0, -1).join(' (')))
        ? 'block' : 'none';
    }

    const noInput = searchQuery === '' && importedVal === 'Store' && authorVal === 'All';

    [...document.getElementsByClassName('gm-store-category')].forEach((x) => x.style.display = noInput ? 'block' : 'none');

    // Keep all header but make height 0 so it breaks flex row
    const allHeader = document.querySelector(':not(.gm-store-category) > .gm-store-header');

    allHeader.style.height = !noInput ? '0px' : '';
    allHeader.style.opacity = !noInput ? '0' : '';
    allHeader.style.margin = !noInput ? '0' : '';
  };

  goosemodScope.settings.updateModuleStoreUI = updateModuleStoreUI;

  const genCurrentDate = new Date();

  const upcomingVal = (x) => {
    const daysSinceUpdate = (genCurrentDate - (x.lastUpdated * 1000)) / 1000 / 60 / 60 / 24;

    return (x.github.stars / daysSinceUpdate) - (x.github.stars / 2) + (1 - daysSinceUpdate);
  };

  [goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins, goosemodScope.i18n.goosemodStrings.settings.itemNames.themes].forEach((x) => goosemodScope.settings.createItem(x, ['',
    {
      type: 'search',

      placeholder: `${goosemodScope.i18n.discordStrings.SEARCH} ${x}`,

      onchange: (query) => {
        searchQuery = query;

        updateModuleStoreUI();
      },

      storeSpecific: true
    },

    {
      type: 'dropdown-individual',

      label: 'Sort by',

      options: [
        'Stars',
        'A-Z',
        'Last Updated'
      ],

      onchange: (val) => {
        sortedVal = val;

        updateModuleStoreUI();
      }
    },

    {
      type: 'dropdown-individual',

      label: 'Author',

      options: () => {
        const idCache = goosemodScope.moduleStoreAPI.idCache.getCache();

        const authors = [...goosemodScope.moduleStoreAPI.modules.reduce((acc, x) => {
          let authors = x.authors;

          if (!Array.isArray(authors)) authors = [ authors ];

          for (const a of authors) {
            let key = a;

            if (typeof a === 'object') {
              key = a.n;
            } else if (a.match(/^[0-9]{17,18}$/)) {
              key = idCache[a]?.data?.username;
            } else {
              const idMatch = a.match(/(.*) \(([0-9]{17,18})\)/); // "<name> (<id>)"

              if (idMatch !== null) {
                key = idMatch[1];
              }
            }

            if (!key) continue;

            acc.set(key, (acc.get(key) || 0) + 1);
          }

          return acc;
        }, new Map()).entries()].sort((a, b) => b[1] - a[1]).map((x) => `${x[0]} (${x[1]})`);

        authors.unshift('All');
        
        return authors;
      },

      onchange: (val) => {
        authorVal = val;

        updateModuleStoreUI();
      }
    },

    {
      type: 'store-category',
      text: 'Top Starred',
      sort: (a, b) => b.github.stars - a.github.stars
    },

    {
      type: 'store-category',
      text: 'Recently Updated',
      sort: (a, b) => b.lastUpdated - a.lastUpdated
    },

    {
      type: 'store-category',
      text: 'Upcoming',
      sort: (a, b) => upcomingVal(b) - upcomingVal(a)
    },

    {
      type: 'store-header',
      text: `All ${x}`
    },

    { type: 'gm-footer' }
  ]));

  goosemodScope.settings.createItem('Snippets', ['',
    {
      type: 'search',

      placeholder: 'Search Snippets',

      onchange: (query) => {
        const cards = document.getElementsByClassName('gm-store-card');

        const fuzzyReg = new RegExp(`.*${query}.*`, 'i');

        for (const c of cards) {
          const description = c.getElementsByClassName('markdown-11q6EU')[0].textContent;

          const matches = (fuzzyReg.test(description));

          c.style.display = matches ? '' : 'none';
        }
      },

      storeSpecific: true
    }
  ]);

  if (gmSettings.get().changelog) {
    if (gmSettings.get().separators) goosemodScope.settings.createSeparator();

    goosemodScope.settings.createItem(goosemodScope.i18n.discordStrings.CHANGE_LOG, [""], async () => {
      GoosemodChangelog.show();
    });
  }

  goosemodScope.settings.createSeparator();

  goosemodScope.settings.createHeading(goosemodScope.i18n.goosemodStrings.settings.itemNames.goosemodModules);

  goosemodScope.settings.items = goosemodScope.settings.items.concat(oldItems);
};