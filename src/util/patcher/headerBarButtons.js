import * as PatcherBase from './base';

let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const patch = (tooltipText, imgSrc, clickHandler, { atEnd = false, showWhere = [ 'dm', 'channel' ] } = {}) => {
  const { React } = goosemodScope.webpackModules.common;

  const headerClasses = goosemod.webpackModules.findByProps('title', 'themed', 'icon', 'icon', 'iconBadge');

  const HeaderBar = goosemodScope.webpackModules.find((x) => x.default && x.default.displayName === 'HeaderBar');

  return PatcherBase.patch(HeaderBar, 'default', (_args, res) => {
    const buttons = res.props.children.props.children[1].props.children.props.children;

    let currentWhere = 'other';

    if (buttons[1] === null) {
      currentWhere = 'home';
    } else switch (buttons[0][1].key) {
      case 'mute': {
        currentWhere = 'channel';
        break;
      }
      
      case 'calls': {
        currentWhere = 'dm';
        break;
      }
    }

    if (!showWhere.includes(currentWhere)) return res;
  
    buttons[atEnd ? 'push' : 'unshift'](
      React.createElement(HeaderBar.Icon, {
        'aria-label': tooltipText,
        tooltip: tooltipText,

        disabled: false,
        showBadge: false,
        selected: false,

        icon: () => (typeof imgSrc !== 'string' ? imgSrc : React.createElement("img", {
          src: imgSrc,
          width: "24px",
          height: "24px",
          className: `${headerClasses}.icon`
        })),
        onClick: () => {
          clickHandler();
        }
      })
    );

    return res;
  });
};