import sleep from '../../util/sleep';

export default (goosemodScope, hasStoreInHome) => {
  const basicSettingItem = (name) => {
    return {
      label: name,
      action: async () => {
        goosemodScope.settings.openSettings();

        await sleep(10);

        [...(document.getElementsByClassName('side-8zPYf6')[0]).children].find((x) => x.textContent === name).click();
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