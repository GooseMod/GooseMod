export default () => {
const { React } = goosemod.webpackModules.common;

const DiscoverStaticGuildCard = goosemod.webpackModules.findByDisplayName('DiscoverStaticGuildCard');

const baseImages = (m) => m.images?.map((x) => {
  if (x.startsWith('/')) {
    const baseUrl = m.repo.split('/').slice(0, -1).join('/');
    x = baseUrl + x;
  }

  return x;
});

return class ModulesPreview extends React.PureComponent {
  render() {
    setTimeout(() => {
      try {
        const splashes = document.querySelectorAll('.discoverPreview-3q1szX .splashImage-352DQ1');

        splashes[splashes.length - 3].src = baseImages(this.props.modules[1])[0];
        splashes[splashes.length - 2].src = baseImages(this.props.modules[0])[0];
        splashes[splashes.length - 1].src = baseImages(this.props.modules[2])[0];
      } catch (e) { // Probably has no images array so ignore

      }
    }, 100);

    return React.createElement('div', {
      className: 'discoverPreview-3q1szX gm-modules-preview'
    },
      React.createElement(DiscoverStaticGuildCard, {
        className: 'placeholderCard-3Zu1qO',

        disabled: true,
        small: true,
        loading: false,

        guild: {
          banner: null,
          splash: null,
          discoverySplash: null,
          icon: null,
          id: null,
          memberCount: null,
          presenceCount: null,
          ...this.props.modules[1] // name, description
        }
      }),

      React.createElement(DiscoverStaticGuildCard, {
        className: 'placeholderCard-3Zu1qO',

        guild: {
          banner: null,
          splash: null,
          discoverySplash: null,
          icon: null,
          id: null,
          memberCount: null,
          presenceCount: null,
          ...this.props.modules[0] // name, description
        }
      }),

      React.createElement(DiscoverStaticGuildCard, {
        className: 'placeholderCard-3Zu1qO',

        disabled: true,
        small: true,
        loading: false,

        guild: {
          banner: null,
          splash: null,
          discoverySplash: null,
          icon: null,
          id: null,
          memberCount: null,
          presenceCount: null,
          ...this.props.modules[2] // name, description
        }
      })
    );
  }
}
};