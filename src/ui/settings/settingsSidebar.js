export default (goosemodScope, gmSettings) => {
  const SettingsView = goosemodScope.webpackModules.findByDisplayName('SettingsView');

  const Text = goosemodScope.webpackModules.findByDisplayName('Text');
  const VersionClasses = goosemodScope.webpackModules.findByProps('versionHash', 'line');

  const { React } = goosemodScope.webpackModules.common;
  
  goosemodScope.settingsUninjects.push(goosemodScope.patcher.patch(SettingsView.prototype, 'getPredicateSections', (_, sections) => {
    const logout = sections.find((c) => c.section === 'logout');
    if (!logout) return sections;
    
    sections.splice(
      sections.indexOf(logout), 0,
      
      ...goosemodScope.settings.items.filter((x) => (gmSettings.get().home ? x[1] !== goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins && x[1] !== goosemodScope.i18n.goosemodStrings.settings.itemNames.themes && x[1] !== 'Snippets': true) && (gmSettings.get().snippets ? x[1] !== 'Snippets' : true)).map((i) => {
        switch (i[0]) {
          case 'item':
          let obj = {
            section: 'gm-' + i[1],
            label: i[1],
            predicate: () => { },
            element: function() {
              if (typeof i[3] === 'function') {
                document.getElementsByClassName('selected-3s45Ha')[0].click();
                
                i[3]();
                
                return React.createElement('div');
              }
              
              const settingsLayerEl = document.querySelector('div[aria-label="USER_SETTINGS"]');
              const settingsSidebarEl = settingsLayerEl.querySelector('nav > div');
              
              if (i[1] === goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins || i[1] === goosemodScope.i18n.goosemodStrings.settings.itemNames.themes || i[1] === 'Snippets') { // Settings expansion for Store panel
                setTimeout(() => {
                  document.querySelector('.sidebarRegion-VFTUkN').style.maxWidth = '218px';
                  document.querySelector('.contentColumnDefault-1VQkGM').style.maxWidth = 'calc(100vw - 218px - 60px - 20px)';
                }, 10);
                
                settingsSidebarEl.addEventListener('click', (e) => {
                  if (e.clientX === 0 // <el>.click() - not an actual user click - as it has no mouse position coords (0, 0)
                  || e.target.textContent === goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins || e.target.textContent === goosemodScope.i18n.goosemodStrings.settings.itemNames.themes || e.target.textContent === 'Snippets') return;  // Clicking on Store when already in it should not break resizing
                  
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
          className: VersionClasses.info
        },
          React.createElement(Text, {
            className: VersionClasses.line,
            size: Text.Sizes.SIZE_12,
            color: Text.Colors.MUTED,
            tag: 'span'
          },
            'GooseMod', ' ', goosemodScope.versioning.version, ' ',
            React.createElement('span', {
              className: VersionClasses.versionHash
            }, '(', goosemodScope.versioning.hash.substring(0, 7), ')')
          ),

          React.createElement(Text, {
            className: VersionClasses.line,
            size: Text.Sizes.SIZE_12,
            color: Text.Colors.MUTED,
            tag: 'span'
          },
            'GooseMod Ext', ' ', window.gmExtension
          ),

          React.createElement(Text, {
            className: VersionClasses.line,
            size: Text.Sizes.SIZE_12,
            color: Text.Colors.MUTED,
            tag: 'span'
          },
            'GM Storage', ' ', goosemodScope.storage.type
          )
        )
      }
      );
      
      return sections;
    }));
};