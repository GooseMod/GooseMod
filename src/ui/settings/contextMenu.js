import sleep from '../../util/sleep';

export default (goosemodScope, hasStoreInHome) => {
  const basicSettingItem = (name) => {
    return {
      label: name,
      action: async () => {
        goosemodScope.settings.openSettings();

        await sleep(10);

        let id = name;

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

        document.querySelector(`[aria-controls="gm-${id.replace(/ /g, '-').toLowerCase()}-tab"]`).click();
      }
    };
  };

  goosemodScope.settingsUninjects.push(goosemodScope.patcher.contextMenu.patch('user-settings-cog', {
    label: 'GooseMod',
    sub: [
      basicSettingItem('#terms.settings#'),
      !hasStoreInHome ? basicSettingItem('#terms.store.plugins#') : undefined,
      !hasStoreInHome ? basicSettingItem('#terms.store.themes#') : undefined,
      basicSettingItem('#terms.changelog#')
    ].filter((x) => x)
  }));

  goosemodScope.settingsUninjects.push(goosemodScope.patcher.contextMenu.patch('user-settings-cog', {
    label: '#terms.goosemod.modules#',
    sub: () => {
      const moduleItems = goosemodScope.settings.items.slice(goosemodScope.settings.items.indexOf(goosemodScope.settings.items.find((x) => x[1] === '#terms.goosemod.modules#')) + 1);

      return moduleItems.map((x) => basicSettingItem(x[1]));
    }
  }));
};