import * as PatcherBase from './base';

let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const patch = (name, imgUrl, forIds, clickHandler = (() => {}), { round = false } = {}) => {
  const { React } = goosemodScope.webpackModules.common;

  const Tooltip = goosemodScope.webpackModules.findByDisplayName('Tooltip');
  const Clickable = goosemodScope.webpackModules.findByDisplayName('Clickable');

  const BadgeClasses = goosemodScope.webpackModules.findByProps('profileBadge24', 'profileBadge22');

  const unpatches = [];
  for (const UserProfileBadgeList of goosemodScope.webpackModules.findByPropsAll('BadgeSizes')) { // there's two near-identical modules: 0 = badge list in new popouts, 1 = profile/other
    unpatches.push(PatcherBase.patch(UserProfileBadgeList, 'default', ([ { user, size } ], res) => {
      if (!forIds().includes(user.id)) return res;

      let sizeClass = BadgeClasses.profileBadge24;

      switch (size) {
        case 1: { // User modal
          sizeClass = BadgeClasses.profileBadge22;
          break;
        }

        case 2: { // User popout
          sizeClass = BadgeClasses.profileBadge18;
          break;
        }
      }

      res.props.children.unshift(
        React.createElement(Tooltip, {
          position: "top",
          text: name
        }, ({
          onMouseLeave,
          onMouseEnter
        }) =>
          React.createElement(Clickable, {
            onClick: () => {
              clickHandler();
            },
            onMouseEnter,
            onMouseLeave
          },
            React.createElement('div', {
              style: {
                backgroundImage: `url("${imgUrl}")`,
                borderRadius: round ? '50%' : ''
              },
              className: `${BadgeClasses.profileBadge} ${sizeClass}`
            })
          )
        )
      );

      return res;
    }));
  }

  return () => unpatches.forEach(x => x());
};
