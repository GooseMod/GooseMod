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
      basicSettingItem(goosemodScope.i18n.discordStrings.SETTINGS),
      !hasStoreInHome ? basicSettingItem(goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins) : undefined,
      !hasStoreInHome ? basicSettingItem(goosemodScope.i18n.goosemodStrings.settings.itemNames.themes) : undefined,
      basicSettingItem(goosemodScope.i18n.discordStrings.CHANGE_LOG)
    ].filter((x) => x)
  }));

  goosemodScope.settingsUninjects.push(goosemodScope.patcher.contextMenu.patch('user-settings-cog', {
    label: goosemodScope.i18n.goosemodStrings.settings.itemNames.goosemodModules,
    sub: () => {
      const moduleItems = goosemodScope.settings.items.slice(goosemodScope.settings.items.indexOf(goosemodScope.settings.items.find((x) => x[1] === goosemodScope.i18n.goosemodStrings.settings.itemNames.goosemodModules)) + 1);

      return moduleItems.map((x) => basicSettingItem(x[1]));
    }
  }));
};