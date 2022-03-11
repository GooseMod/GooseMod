import sleep from '../../util/sleep';

export default async (goosemodScope, gmSettings) => {
  let SettingsView;
  while (!(SettingsView = goosemodScope.webpackModules.findByDisplayName('SettingsView'))) await sleep(50);


  const Text = goosemodScope.webpackModules.findByDisplayName('Text');

  const { React } = goosemodScope.webpackModules.common;
  
  goosemodScope.settingsUninjects.push(goosemodScope.patcher.patch(SettingsView.prototype, 'getPredicateSections', (_, sections) => {
    const logout = sections.find((c) => c.section === 'logout');
    if (!logout) return sections;
    
    sections.splice(
      sections.indexOf(logout), 0,
      
      ...goosemodScope.settings.items.filter((x) => (gmSettings.home ? x[1] !== '#terms.store.plugins#' && x[1] !== '#terms.store.themes#' && x[1] !== '#terms.store.snippets#': true) && (!gmSettings.snippets ? x[1] !== '#terms.store.snippets#' : true)).map((i) => {
        switch (i[0]) {
          case 'item':
          let id = i[1];

          switch (id) { // Special IDs (attributes in DOM elements) for GM built-in i18n labels for easier theming
            case '#terms.settings#': {
              id = 'settings';
              break;
            }

            case '#terms.store.plugins#': {
              id = 'plugins';
              break;
            }

            case '#terms.store.themes#': {
              id = 'themes';
              break;
            }

            case '#terms.store.snippets#': {
              id = 'snippets';
              break;
            }

            case '#terms.changelog#': {
              id = 'changelog';
              break;
            }
          }

          let obj = {
            section: 'gm-' + id,
            label: i[1],
            predicate: () => { },
            element: function() {
              if (typeof i[3] === 'function') {
                document.querySelector('.item-3XjbnG.selected-g-kMVV:not(.item-3mHhwr)').click();
                
                i[3]();
                
                return React.createElement('div');
              }

              const settingsSidebarEl = document.querySelector('.standardSidebarView-E9Pc3j nav > div');
              
              if (i[1] === '#terms.store.plugins#' || i[1] === '#terms.store.themes#' || i[1] === '#terms.store.snippets#') { // Settings expansion for Store panel
                setTimeout(() => {
                  document.querySelector('.sidebarRegion-VFTUkN').style.maxWidth = '218px';
                  document.querySelector('.contentColumnDefault-1VQkGM').style.maxWidth = 'calc(100vw - 218px - 60px - 20px)';
                }, 10);
                
                settingsSidebarEl.addEventListener('click', (e) => {
                  if (e.clientX === 0 // <el>.click() - not an actual user click - as it has no mouse position coords (0, 0)
                  || e.target.textContent === '#terms.store.plugins#' || e.target.textContent === '#terms.store.themes#' || e.target.textContent === '#terms.store.snippets#') return;  // Clicking on Store when already in it should not break resizing
                  
                  document.querySelector('.sidebarRegion-VFTUkN').style.maxWidth = '50%';
                  document.querySelector('.contentColumnDefault-1VQkGM').style.maxWidth = '740px';
                });
              }
              
              return goosemodScope.settings._createItem(i[1], i[2]);
            }
          };
          if (i[4]) obj.color = '#f04747';
          return obj;
          
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
    
    
    sections.push(
      {
        section: 'DIVIDER'
      },

      {
        section: 'CUSTOM',
        element: () => React.createElement('div', {
          className: 'info-3pQQBb'
        },
          React.createElement(Text, {
            className: 'line-18uChy',
            size: Text.Sizes.SIZE_12,
            color: Text.Colors.MUTED,
            tag: 'span'
          },
            'GooseMod', ' ', goosemodScope.versioning.version, ' ',
            React.createElement('span', {
              className: 'versionHash-mssSIL'
            }, '(', goosemodScope.versioning.hash.substring(0, 7), ')')
          ),

          React.createElement(Text, {
            className: 'line-18uChy',
            size: Text.Sizes.SIZE_12,
            color: Text.Colors.MUTED,
            tag: 'span'
          },
            'GooseMod Ext', ' ', window.gmExtension
          )
        )
      }
      );
      
      return sections;
  }));

  if (goosemodScope.settings.isSettingsOpen()) goosemodScope.settings.reopenSettings();
};