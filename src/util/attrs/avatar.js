let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const patch = () => {
  const { React } = goosemodScope.webpackModules.common;

  const Avatar = goosemodScope.webpackModules.findByProps('Sizes', 'AnimatedAvatar');

  goosemodScope.patcher.patch(Avatar, 'default', ([ { src } ], res) => {
    if (!src.includes('/avatars')) return;

    res.props['data-user-id'] = src.match(/\/avatars\/([0-9]+)\//)[1];

    return res;
  });

  // Patch AnimatedAvatar to force rerender
  goosemodScope.patcher.patch(Avatar.AnimatedAvatar, 'type', (_args, res) => {
    return React.createElement(Avatar.default, { ...res.props });
  });
};