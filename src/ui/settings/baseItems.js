import sleep from '../../util/sleep';
import * as GoosemodChangelog from '../goosemodChangelog';

export default (goosemodScope, gmSettings) => {
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
          localStorage.setItem('goosemodUntetheredBranch', 'dev');
        } else {
          localStorage.removeItem('goosemodUntetheredBranch');
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

      /* color: #32cd32; background-color: #32cd32; margin-right: 3px; color: black; padding: 2px; border-radius: 4px; */
      text: '<svg style="color: var(--header-primary); margin-right: 2px; padding: 1px;" width="1.5em" height="1.5em" viewBox="0 0 16 16"><path style="fill: currentColor" fill-rule="evenodd" d="M5 5.782V2.5h-.25a.75.75 0 0 1 0-1.5h6.5a.75.75 0 0 1 0 1.5H11v3.282l3.666 5.76C15.619 13.04 14.543 15 12.767 15H3.233c-1.776 0-2.852-1.96-1.899-3.458L5 5.782zM9.5 2.5h-3V6a.75.75 0 0 1-.117.403L4.73 9h6.54L9.617 6.403A.75.75 0 0 1 9.5 6V2.5zm-6.9 9.847L3.775 10.5h8.45l1.175 1.847a.75.75 0 0 1-.633 1.153H3.233a.75.75 0 0 1-.633-1.153z"/></svg> <span style="vertical-align: top;">Force Theme Settings</span>',
      subtext: 'Experimental: Force auto-generated settings for all themes, <strong>requires refresh</strong>',

      onToggle: (c) => changeSetting('allThemeSettings', c),
      isToggled: () => gmSettings.get().allThemeSettings
    },

    {
      type: 'toggle',

      text: 'Store In Home',
      subtext: 'Put GooseMod Store options in home instead of in settings, <strong>requires refresh</strong>',

      onToggle: (c) => changeSetting('home', c),
      isToggled: () => gmSettings.get().home
    },

    {
      type: 'header',
      text: 'Module Store'
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
      text: 'Internals'
    },

    {
      type: 'toggle',

      /* color: #32cd32; background-color: #32cd32; margin-right: 3px; color: black; padding: 2px; border-radius: 4px; */
      text: '<svg style="color: var(--header-primary); margin-right: 2px; padding: 1px;" width="1.5em" height="1.5em" viewBox="0 0 16 16"><path style="fill: currentColor" fill-rule="evenodd" d="M5 5.782V2.5h-.25a.75.75 0 0 1 0-1.5h6.5a.75.75 0 0 1 0 1.5H11v3.282l3.666 5.76C15.619 13.04 14.543 15 12.767 15H3.233c-1.776 0-2.852-1.96-1.899-3.458L5 5.782zM9.5 2.5h-3V6a.75.75 0 0 1-.117.403L4.73 9h6.54L9.617 6.403A.75.75 0 0 1 9.5 6V2.5zm-6.9 9.847L3.775 10.5h8.45l1.175 1.847a.75.75 0 0 1-.633 1.153H3.233a.75.75 0 0 1-.633-1.153z"/></svg> <span style="vertical-align: top;">Development Channel</span>',
      subtext: 'Use experimental development GooseMod builds, <strong>requires refresh</strong>',

      onToggle: (c) => changeSetting('devchannel', c),
      isToggled: () => localStorage.getItem('goosemodUntetheredBranch') === 'dev'
    },

    {
      type: 'toggle',

      /* color: #32cd32; background-color: #32cd32; margin-right: 3px; color: black; padding: 2px; border-radius: 4px; */
      text: '<svg style="color: var(--header-primary); margin-right: 2px; padding: 1px;" width="1.5em" height="1.5em" viewBox="0 0 16 16"><path style="fill: currentColor" fill-rule="evenodd" d="M5 5.782V2.5h-.25a.75.75 0 0 1 0-1.5h6.5a.75.75 0 0 1 0 1.5H11v3.282l3.666 5.76C15.619 13.04 14.543 15 12.767 15H3.233c-1.776 0-2.852-1.96-1.899-3.458L5 5.782zM9.5 2.5h-3V6a.75.75 0 0 1-.117.403L4.73 9h6.54L9.617 6.403A.75.75 0 0 1 9.5 6V2.5zm-6.9 9.847L3.775 10.5h8.45l1.175 1.847a.75.75 0 0 1-.633 1.153H3.233a.75.75 0 0 1-.633-1.153z"/></svg> <span style="vertical-align: top;">Data Attributes</span>',
      subtext: 'Add data attributes to some elements for some themes to use, <strong>requires refresh</strong>',

      onToggle: (c) => changeSetting('attrs', c),
      isToggled: () => gmSettings.get().attrs
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
      text: 'i18n'
    },

    {
      type: 'dropdown',

      /* color: #32cd32; background-color: #32cd32; margin-right: 3px; color: black; padding: 2px; border-radius: 4px; */
      text: '<svg style="color: var(--header-primary); margin-right: 2px; padding: 1px;" width="1.5em" height="1.5em" viewBox="0 0 16 16"><path style="fill: currentColor" fill-rule="evenodd" d="M8.22 1.754a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368L8.22 1.754zm-1.763-.707c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575L6.457 1.047zM9 11a1 1 0 1 1-2 0a1 1 0 0 1 2 0zm-.25-5.25a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0v-2.5z"/></svg> <span style="vertical-align: top;">Force GM lang</span>',
      subtext: 'Forces internal GM lang to dropdown value temporarily',

      onchange: (c) => {
        goosemodScope.i18n.forceLang(c);
      },

      options: async () => [
        'Unspecified',

        'de',
        'en-GB',
        'en-US',
        'es-ES',
        'fr',
        'hu',
        'it',
        'nl',
        'pl',
        'pt-BR',
        'ru',
        'tr',
        'zh-CN'
      ]
    },

    {
      type: 'header',
      text: 'Utilities'
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
      type: 'text-and-danger-button',

      text: 'Purge Caches',
      subtext: 'Purges (completely removes) most caches GooseMod uses',
      buttonText: 'Purge',

      onclick: async () => {
        // Like remove's dynamic local storage removal, but only remove GooseMod keys with "Cache" in 

        Object.keys(localStorage).filter((x) => x.toLowerCase().startsWith('goosemod') && x.includes('Cache')).forEach((x) => localStorage.removeItem(x));
      }
    },

    { type: 'gm-footer' }
  ]);

  if (gmSettings.get().separators && !gmSettings.get().home) goosemodScope.settings.createSeparator();

  let sortedVal = 'Stars';
  let importedVal = 'All';
  let authorVal = 'All';

  const updateModuleStoreUI = (parentEl) => {
    const containerEl = parentEl.children[0];
    const cards = [...containerEl.children[containerEl.children.length - 2].children].filter((x) => x.getElementsByClassName('description-3_Ncsb')[1]);

    const inp = parentEl.querySelector('[contenteditable=true]').innerText.replace('\n', '');

    const fuzzyReg = new RegExp(`.*${inp}.*`, 'i');

    for (let c of cards) {
      const titles = c.getElementsByClassName('title-31JmR4');
      if (!titles[0]) continue; // Not card

      const title = titles[1];

      const authors = [...titles[0].getElementsByClassName('author')].map((x) => x.textContent.split('#')[0]);
      const name = title.childNodes[0].wholeText;

      const description = c.getElementsByClassName('description-3_Ncsb')[0].innerText;

      const matches = (fuzzyReg.test(name) || fuzzyReg.test(description));

      const importedSelector = c.getElementsByClassName('control-2BBjec')[0].style.display === 'block' ? goosemodScope.i18n.goosemodStrings.moduleStore.selectors.imported : goosemodScope.i18n.goosemodStrings.moduleStore.selectors.notImported;

      const tags = [...c.classList].map((t) => t.replace(/\|/g, ' ').toLowerCase());

      switch (sortedVal) {
        case 'A-Z': { // Already pre-sorted to A-Z
          c.style.order = '0';

          break;
        }

        case 'Last Updated': {
          const module = goosemodScope.moduleStoreAPI.modules.find((x) => x.name === name.trim());

          c.style.order = '-' + module.lastUpdated;

          break;
        }

        case 'Stars': {
          c.style.order = '-' + c.children[4].children[0].children[0].textContent;

          break;
        }
      }

      c.style.display = matches
        && (importedVal === 'All' || importedVal === importedSelector)
        && (authorVal === 'All' || authors.includes(authorVal.split(' (').slice(0, -1).join(' (')))
        ? 'block' : 'none';
    }

    [...parentEl.getElementsByClassName('storeCategory')].concat([...parentEl.getElementsByClassName('headerContainer-1Wluzl')]).forEach((x) => x.style.display = inp === '' && importedVal === 'All' && authorVal === 'All' ? 'block' : 'none');
  };

  const genCurrentDate = new Date();

  const upcomingVal = (x) => {
    const daysSinceUpdate = (genCurrentDate - (x.lastUpdated * 1000)) / 1000 / 60 / 60 / 24;

    return (x.github.stars / daysSinceUpdate) - (x.github.stars / 2) + (1 - daysSinceUpdate);
  };

  [goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins, goosemodScope.i18n.goosemodStrings.settings.itemNames.themes].forEach((x) => goosemodScope.settings.createItem(x, ['',
    {
      type: 'search',
      onchange: (inp, parentEl) => {
        updateModuleStoreUI(parentEl);
      },
      storeSpecific: true
    },

    {
      type: 'dropdown-individual',

      label: 'Sort by',

      options: async () => [
        'Stars',
        'A-Z',
        'Last Updated'
      ],

      onchange: (val, parentEl) => {
        sortedVal = val;

        updateModuleStoreUI(parentEl);
      }
    },

    {
      type: 'dropdown-individual',

      label: 'Author',

      options: async (parentEl) => {
        await sleep(10);

        const containerEl = parentEl.children[0];
        const cards = [...containerEl.children[containerEl.children.length - 2].children].filter((x) => x.getElementsByClassName('description-3_Ncsb')[1]);

        const authors = [...cards.reduce((acc, e) => {
          for (let el of e.getElementsByClassName('author')) {
            const x = el.textContent.split('#')[0];
            acc.set(x, (acc.get(x) || 0) + (e.style.display !== 'none' ? 1 : 0));
          }

          return acc;
        }, new Map()).entries()].sort((a, b) => b[1] - a[1]).map((x) => `${x[0]} (${x[1]})`);

        authors.unshift('All');

        return authors;
      },

      onchange: (val, parentEl) => {
        authorVal = val;

        updateModuleStoreUI(parentEl);
      }
    },

    {
      type: 'dropdown-individual',

      label: goosemodScope.i18n.goosemodStrings.moduleStore.selectors.imported,

      options: async () => [
        'All',
        goosemodScope.i18n.goosemodStrings.moduleStore.selectors.imported,
        goosemodScope.i18n.goosemodStrings.moduleStore.selectors.notImported
      ],

      onchange: (val, parentEl) => {
        importedVal = val;

        updateModuleStoreUI(parentEl);
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