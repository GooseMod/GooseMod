export default (goosemodScope, gmSettings) => {
  const SettingsView = goosemodScope.webpackModules.findByDisplayName('SettingsView');
  const { React } = goosemodScope.webpackModules.common;

  goosemodScope.settingsUninjects.push(goosemodScope.patcher.patch(SettingsView.prototype, 'getPredicateSections', (_, sections) => {
    const logout = sections.find((c) => c.section === 'logout');
    if (!logout) return sections;

      sections.splice(
        sections.indexOf(logout), 0,

        ...goosemodScope.settings.items.filter((x) => gmSettings.get().home ? x[1] !== goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins && x[1] !== goosemodScope.i18n.goosemodStrings.settings.itemNames.themes : true).map((i) => {
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

                  if (i[1] === goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins || i[1] === goosemodScope.i18n.goosemodStrings.settings.itemNames.themes) { // Settings expansion for Module Store panel
                    setTimeout(() => {
                      document.querySelector('.sidebarRegion-VFTUkN').style.maxWidth = '218px';
                      document.querySelector('.contentColumnDefault-1VQkGM').style.maxWidth = 'calc(100vw - 218px - 60px - 20px)';
                    }, 10);

                    settingsSidebarEl.addEventListener('click', (e) => {
                      if (e.clientX === 0 // <el>.click() - not an actual user click - as it has no mouse position coords (0, 0)
                        || e.target.textContent === goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins || e.target.textContent === goosemodScope.i18n.goosemodStrings.settings.itemNames.themes) return;  // Clicking on Module Store when already in it should not break resizing

                      document.querySelector('.sidebarRegion-VFTUkN').style.maxWidth = '50%';
                      document.querySelector('.contentColumnDefault-1VQkGM').style.maxWidth = '740px';
                    });
                  }
                  
                  let contentEl = goosemodScope.settings._createItem(i[1], i[2]);

                  const ref = React.useRef(null);

                  React.useEffect(() => { ref.current.appendChild(contentEl); }, []);

                  return React.createElement('div', {
                    ref
                  });
                  //return React.createElement(VanillaElement, { vanillaChild: contentEl });
                }
              };
              if (i[4]) obj.color = '#f04747';
              return obj;
              //goosemodScope.settings._createItem(i[1], i[2], i[3], i[4]);

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

    const versionInfoEl = sections.find((x) => x.section === 'CUSTOM' && x.element && (x.element()).props?.children[0]?.props?.children[4]?.props.className === 'versionHash-2gXjIB').element();


    let goosemodVersionInfo = React.cloneElement(versionInfoEl);

    goosemodVersionInfo.props.children = [];

    let goosemodVersion = React.cloneElement(versionInfoEl.props.children[0]);

    goosemodVersion.props.children[0] = 'GooseMod';
    goosemodVersion.props.children[2] = goosemodScope.versioning.version;

    goosemodVersion.props.children[4].props.children[1] = goosemodScope.versioning.hash.substring(0, 7);

    goosemodVersionInfo.props.children.push(goosemodVersion);

    let untetheredVersion = React.cloneElement(versionInfoEl.props.children[1] || versionInfoEl.props.children[2]);

    untetheredVersion.props.children[0] = 'GooseMod Untethered ';
    untetheredVersion.props.children[1] = goosemodScope.untetheredVersion || 'N/A';

    goosemodVersionInfo.props.children.push(untetheredVersion);

    sections.push(
      {
        section: 'DIVIDER'
      },
      {
        section: 'CUSTOM',
        element: () => goosemodVersionInfo
      }
    );

    return sections;
  }));
};