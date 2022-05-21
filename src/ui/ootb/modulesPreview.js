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
        const splashes = document.querySelectorAll('.gm-modules-preview [class*="splashImage"]');

        splashes[splashes.length - 3].src = baseImages(this.props.modules[1])[0];
        splashes[splashes.length - 2].src = baseImages(this.props.modules[0])[0];
        splashes[splashes.length - 1].src = baseImages(this.props.modules[2])[0];
      } catch (e) { // Probably has no images array so ignore

      }
    }, 100);

    const cardClass = `placeholderCard-2jZYky`;

    return React.createElement('div', {
      className: 'gm-modules-preview'
    },
      React.createElement(DiscoverStaticGuildCard, {
        className: cardClass,

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
        className: cardClass,

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
        className: cardClass,

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
