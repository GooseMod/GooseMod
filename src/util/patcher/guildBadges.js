import * as PatcherBase from './base';

let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const patch = (name, imgUrl, forIds, clickHandler = (() => {}), { round = false } = {}) => {
  const { React } = goosemodScope.webpackModules.common;

  const Tooltip = goosemodScope.webpackModules.findByDisplayName('Tooltip');
  const Clickable = goosemodScope.webpackModules.findByDisplayName('Clickable');

  const BadgeClasses = goosemodScope.webpackModules.findByProps('guildIconContainer');

  const GuildHeader = goosemodScope.webpackModules.findByDisplayName('GuildHeader');
  
  return PatcherBase.patch(GuildHeader.prototype, 'renderHeader', function (_args, res) {
    if (!forIds().includes(this.props.guild?.id)) return res;

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
              borderRadius: round ? '50%' : '',

              width: '16px',
              height: '16px',

              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundPosition: '50%',
              objectFit: 'cover'
            },
            className: `${BadgeClasses.guildIconContainer}`
          })
        )
      )
    );

    return res;
  });
};
