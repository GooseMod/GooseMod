import Card from './ui/settings/items/card';

export default () => {
  const { React, ReactDOM } = goosemod.webpackModules.common;
    
  const UserProfileModal = goosemod.webpackModules.find((x) => x.default?.displayName === 'UserProfileModal');

  const ScrollerClasses = goosemod.webpackModules.findByProps('auto', 'scrollerBase');

  goosemod.patcher.patch(UserProfileModal, 'default', (_args, res) => {
    const UserProfileTabBar = goosemod.reactUtils.findInReactTree(res.props.children, (x) => x.props?.section);
    if (!UserProfileTabBar) return;
    
    goosemod.patcher.patch(UserProfileTabBar, 'type', ([ { user: { id } } ], res) => {
      const modules = goosemod.moduleStoreAPI.modules.filter((x) => x.authors.some && x.authors.some((x) => x.i === id));

      if (modules.length === 0) return;
      
      const themesItem = goosemod.settings.items.find((x) => x[1] === goosemod.i18n.goosemodStrings.settings.itemNames.themes)[2];
      const pluginsItem = goosemod.settings.items.find((x) => x[1] === goosemod.i18n.goosemodStrings.settings.itemNames.plugins)[2];
      
      const themes = modules.filter((x) => x.tags.includes('theme'));
      const plugins = modules.filter((x) => !x.tags.includes('theme'));
      
      
      const tabbar = res.props.children;
      const baseOff = tabbar.props.children[0];
      
      goosemod.patcher.patch(tabbar.props, 'onItemSelect', ([ selected ]) => {
        if (!selected.startsWith('GM_')) return;
        
        setTimeout(() => {
          const target = document.querySelector(`.body-r6_QPy > :first-child`);
          
          ReactDOM.render(React.createElement('div', {
            className: [ScrollerClasses.auto, 'gm-modules-container'].join(' ')
          },
            ...themes.map((x) => themesItem.find((y) => y.name === x.name)).map((x) => React.createElement(Card, { ...x, mini: true })),
            ...plugins.map((x) => pluginsItem.find((y) => y.name === x.name)).map((x) => React.createElement(Card, { ...x, mini: true })),
          ), target);
        }, 1);
      });
      
      tabbar.props.children.push(React.cloneElement(baseOff, {
        id: 'GM_MODULES'
      }, 'GooseMod Modules'));
      
      return res;
    });
  });
};