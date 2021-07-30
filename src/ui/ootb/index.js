import sleep from '../../util/sleep';


export let enabled = false;
export let todo = [
  'themes',
  'plugins'
];

export const done = (thing) => {
  todo.splice(todo.indexOf(thing), 1);
};

export const themes = async () => {
  const ModulesPreview = await import('./modulesPreview').default;

  const { React } = goosemod.webpackModules.common;

  // const RoutingUtils = goosemod.webpackModules.findByProps('transitionTo');

  const Header = goosemod.webpackModules.findByDisplayName('Header');
  const Text = goosemod.webpackModules.findByDisplayName('Text');

  const possibleThemes = goosemod.moduleStoreAPI.modules.filter((x) => x.tags.includes('theme') && x.images && x.images[0]).sort((a, b) => b.github.stars - a.github.stars);
  const themeIndex = Math.floor(Math.random() * (possibleThemes.length - 5));

  goosemod.webpackModules.findByProps('show').show({
    className: 'gm-ootb-modal',

    title: 'Themes',

    confirmText: 'Browse Themes',

    onConfirm: async () => {
      if (goosemod.ootb.todo.length === 0) {
        /* while (document.querySelector('#gm-home-themes').classList.contains('selected-aXhQR6')) {
          await sleep(100);
        } */

        await sleep(2000);

        goosemod.ootb.settings();
      }
    },

    body: React.createElement('div', {
      className: 'container-1rn8Cv'
    },
      React.createElement(ModulesPreview, {
        modules: possibleThemes.slice(themeIndex, themeIndex + 3)
      }),

      React.createElement(Header, {
        className: "header-2MiVco",

        size: Header.Sizes.SIZE_24
      }, 'Beautify your Discord with Themes'),

      React.createElement(Text, {
        className: "byline-3REiHf",

        size: Text.Sizes.SIZE_16,
        color: Text.Colors.HEADER_SECONDARY
      }, 'Pick from over 100 themes to tweak and enhance your user interface')
    )
  });
};

export const plugins = async () => {
  const ModulesPreview = await import('./modulesPreview').default();

  const { React } = goosemod.webpackModules.common;

  // const RoutingUtils = goosemod.webpackModules.findByProps('transitionTo');

  const Header = goosemod.webpackModules.findByDisplayName('Header');
  const Text = goosemod.webpackModules.findByDisplayName('Text');

  const possiblePlugins = goosemod.moduleStoreAPI.modules.filter((x) => !x.tags.includes('theme') && x.images && x.images[0]).sort((a, b) => b.github.stars - a.github.stars);
  const pluginIndex = Math.floor(Math.random() * (possiblePlugins.length - 5));

  goosemod.webpackModules.findByProps('show').show({
    className: 'gm-ootb-modal',

    title: 'Plugins',

    confirmText: 'Browse Plugins',

    onConfirm: async () => {
      if (goosemod.ootb.todo.length === 0) {
        /* while (document.querySelector('#gm-home-plugins').classList.contains('selected-aXhQR6')) {
          await sleep(100);
        } */

        await sleep(2000);

        goosemod.ootb.settings();
      }
    },

    body: React.createElement('div', {
      className: 'container-1rn8Cv'
    },
      React.createElement(ModulesPreview, {
        modules: possiblePlugins.slice(pluginIndex, pluginIndex + 3)
      }),

      React.createElement(Header, {
        className: "header-2MiVco",

        size: Header.Sizes.SIZE_24
      }, 'Amplify your Discord under the hood'),

      React.createElement(Text, {
        className: "byline-3REiHf",

        size: Text.Sizes.SIZE_16,
        color: Text.Colors.HEADER_SECONDARY
      }, 'Plugins augment your experience with improvements in the app itself')
    )
  });
};

export const store = async () => {
  const ModulesPreview = await import('./modulesPreview').default;

  const { React } = goosemod.webpackModules.common;

  const RoutingUtils = goosemod.webpackModules.findByProps('transitionTo');

  const Header = goosemod.webpackModules.findByDisplayName('Header');
  const Text = goosemod.webpackModules.findByDisplayName('Text');

  const possibleModules = goosemod.moduleStoreAPI.modules.filter((x) => x.images && x.images[0]).sort((a, b) => b.github.stars - a.github.stars);
  const moduleIndex = Math.floor(Math.random() * (possibleModules.length - 5));

  goosemod.webpackModules.findByProps('show').show({
    className: 'gm-ootb-modal',

    title: 'Store',

    confirmText: 'View Store in Home',

    onConfirm: async () => {
      RoutingUtils.transitionTo('/channels/@me'); // Go to home

      await sleep(100);
      
      document.body.classList.add('gm-highlight');

      await sleep(3000);

      document.body.classList.remove('gm-highlight');
    },

    body: React.createElement('div', {
      className: 'container-1rn8Cv'
    },
      React.createElement(ModulesPreview, {
        modules: possibleModules.slice(moduleIndex, moduleIndex + 3)
      }),

      React.createElement(Header, {
        className: "header-2MiVco",

        size: Header.Sizes.SIZE_24
      }, 'Browse Themes and Plugins in the Store'),

      React.createElement(Text, {
        className: "byline-3REiHf",

        size: Text.Sizes.SIZE_16,
        color: Text.Colors.HEADER_SECONDARY
      }, 'GooseMod uses it\'s own Store, where you can easily look around and install')
    )
  });
};

export const settings = async () => {
  const ModulesPreview = await import('./modulesPreview').default;

  const { React } = goosemod.webpackModules.common;

  const Header = goosemod.webpackModules.findByDisplayName('Header');
  const Text = goosemod.webpackModules.findByDisplayName('Text');

  goosemod.webpackModules.findByProps('show').show({
    className: 'gm-ootb-modal',

    title: 'Settings',

    confirmText: 'View GooseMod Settings',

    onConfirm: async () => {
      goosemod.settings.openSettings();

      await sleep(20);

      document.querySelector(`[aria-controls="gm-${goosemod.i18n.discordStrings.SETTINGS}-tab"]`).click(); // Open GM Settings page

      const scroller = document.querySelector(`.sidebarRegionScroller-3MXcoP`); // Scroll to bottom of Settings
      scroller.scrollTop = scroller.offsetHeight - 270;

      while (document.querySelector('.closeButton-1tv5uR')) {
        await sleep(100);
      }

      goosemod.ootb.community();
    },

    body: React.createElement('div', {
      className: 'container-1rn8Cv'
    },
      React.createElement(ModulesPreview, {
        modules: [
          {
            name: 'Experimental Features',
            description: 'Try out new experimental features'
          },

          {
            name: 'Utilities',
            description: 'Make backups, reset GooseMod, and more'
          },

          {
            name: 'Tweaks',
            description: 'Tweak GooseMod to how you want it'
          }
        ]
      }),

      React.createElement(Header, {
        className: "header-2MiVco",

        size: Header.Sizes.SIZE_24
      }, 'Use GooseMod\'s Settings to customise it\'s features'),

      React.createElement(Text, {
        className: "byline-3REiHf",

        size: Text.Sizes.SIZE_16,
        color: Text.Colors.HEADER_SECONDARY
      }, 'There are various options for you to change')
    )
  });
};

export const community = async () => {
  const ModulesPreview = await import('./modulesPreview').default;

  const { React } = goosemod.webpackModules.common;

  const Header = goosemod.webpackModules.findByDisplayName('Header');
  const Text = goosemod.webpackModules.findByDisplayName('Text');

  goosemod.webpackModules.findByProps('show').show({
    className: 'gm-ootb-modal',

    title: 'Community',

    confirmText: 'Join GooseMod Discord',

    onConfirm: () => {
      window.open('https://goosemod.com/discord');
    },

    body: React.createElement('div', {
      className: 'container-1rn8Cv'
    },
      React.createElement(ModulesPreview, {
        modules: [
          {
            name: 'Ask Questions',
            description: 'Ask any questions and get support'
          },

          {
            name: 'News',
            description: 'Get the latest news and announcements around GooseMod and related projects'
          },

          {
            name: 'Get Involved',
            description: 'Help out with suggestions, supporting others, and more'
          }
        ]
      }),

      React.createElement(Header, {
        className: "header-2MiVco",

        size: Header.Sizes.SIZE_24
      }, 'Join GooseMod\'s Community'),

      React.createElement(Text, {
        className: "byline-3REiHf",

        size: Text.Sizes.SIZE_16,
        color: Text.Colors.HEADER_SECONDARY
      }, 'Join our Discord for further information and more')
    )
  });
};

export const start = async () => {
  const ModulesPreview = await import('./modulesPreview').default;

  const { React } = goosemod.webpackModules.common;

  const Header = goosemod.webpackModules.findByDisplayName('Header');
  const Text = goosemod.webpackModules.findByDisplayName('Text');

  goosemod.webpackModules.findByProps('show').show({
    className: 'gm-ootb-modal',

    title: 'GooseMod',

    confirmText: 'Learn More',
    cancelText: 'Not Interested',

    onConfirm: () => {
      goosemod.ootb.enabled = true;

      goosemod.ootb.store();
    },

    body: React.createElement('div', {
      className: 'container-1rn8Cv'
    },
      React.createElement(ModulesPreview, {
        modules: [
          {
            name: 'Store',
            description: 'Learn about GooseMod\'s Store and what\'s in it'
          },

          {
            name: 'Settings',
            description: 'Find out about the settings for GooseMod and plugins'
          },

          {
            name: 'Community',
            description: 'Join our Discord to ask questions, give feedback, keep up to date with news, and more'
          }
        ]
      }),

      React.createElement(Header, {
        className: "header-2MiVco",

        size: Header.Sizes.SIZE_24
      }, 'Learn about GooseMod'),

      React.createElement(Text, {
        className: "byline-3REiHf",

        size: Text.Sizes.SIZE_16,
        color: Text.Colors.HEADER_SECONDARY
      }, 'Go through a short tour through GooseMod\'s core functions')
    )
  });
};