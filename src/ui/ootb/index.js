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
  const ModulesPreview = (await import('./modulesPreview')).default();

  const { React } = goosemod.webpackModules.common;

  // const RoutingUtils = goosemod.webpackModules.findByProps('transitionTo');

  const Header = goosemod.webpackModules.find((x) => x.displayName === 'Header' && x.Sizes);
  const Text = goosemod.webpackModules.findByDisplayName('Text');

  const possibleThemes = goosemod.moduleStoreAPI.modules.filter((x) => x.tags.includes('theme') && x.images && x.images[0]).sort((a, b) => b.github.stars - a.github.stars);
  const themeIndex = Math.floor(Math.random() * (possibleThemes.length - 5));

  goosemod.webpackModules.find((x) => x.show && x.show.toString().includes('confirmText')).show({
    className: 'gm-ootb-modal',

    title: '#terms.store.themes#',

    confirmText: '#ootb.themes.confirm#',

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
      }, '#ootb.themes.text.main#'),

      React.createElement(Text, {
        className: "byline-3REiHf",

        size: Text.Sizes.SIZE_16,
        color: Text.Colors.HEADER_SECONDARY
      }, '#ootb.themes.text.subtext#')
    )
  });
};

export const plugins = async () => {
  const ModulesPreview = (await import('./modulesPreview')).default();

  const { React } = goosemod.webpackModules.common;

  // const RoutingUtils = goosemod.webpackModules.findByProps('transitionTo');

  const Header = goosemod.webpackModules.find((x) => x.displayName === 'Header' && x.Sizes);
  const Text = goosemod.webpackModules.findByDisplayName('Text');

  const possiblePlugins = goosemod.moduleStoreAPI.modules.filter((x) => !x.tags.includes('theme') && x.images && x.images[0]).sort((a, b) => b.github.stars - a.github.stars);
  const pluginIndex = Math.floor(Math.random() * (possiblePlugins.length - 5));

  goosemod.webpackModules.find((x) => x.show && x.show.toString().includes('confirmText')).show({
    className: 'gm-ootb-modal',

    title: '#terms.store.plugins#',

    confirmText: '#ootb.plugins.confirm#',

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
      }, '#ootb.plugins.text.main#'),

      React.createElement(Text, {
        className: "byline-3REiHf",

        size: Text.Sizes.SIZE_16,
        color: Text.Colors.HEADER_SECONDARY
      }, '#ootb.plugins.text.subtext#')
    )
  });
};

export const store = async () => {
  const ModulesPreview = (await import('./modulesPreview')).default();

  const { React } = goosemod.webpackModules.common;

  const RoutingUtils = goosemod.webpackModules.findByProps('transitionTo');

  const Header = goosemod.webpackModules.find((x) => x.displayName === 'Header' && x.Sizes);
  const Text = goosemod.webpackModules.findByDisplayName('Text');

  const possibleModules = goosemod.moduleStoreAPI.modules.filter((x) => x.images && x.images[0]).sort((a, b) => b.github.stars - a.github.stars);
  const moduleIndex = Math.floor(Math.random() * (possibleModules.length - 5));

  goosemod.webpackModules.find((x) => x.show && x.show.toString().includes('confirmText')).show({
    className: 'gm-ootb-modal',

    title: '#terms.store.store#',

    confirmText: '#ootb.store.confirm#',

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
      }, '#ootb.store.text.main#'),

      React.createElement(Text, {
        className: "byline-3REiHf",

        size: Text.Sizes.SIZE_16,
        color: Text.Colors.HEADER_SECONDARY
      }, '#ootb.store.text.subtext#')
    )
  });
};

export const settings = async () => {
  const ModulesPreview = (await import('./modulesPreview')).default();

  const { React } = goosemod.webpackModules.common;

  const Header = goosemod.webpackModules.find((x) => x.displayName === 'Header' && x.Sizes);
  const Text = goosemod.webpackModules.findByDisplayName('Text');

  goosemod.webpackModules.find((x) => x.show && x.show.toString().includes('confirmText')).show({
    className: 'gm-ootb-modal',

    title: '#terms.settings#',

    confirmText: '#ootb.settings.confirm#',

    onConfirm: async () => {
      goosemod.settings.openSettings();

      await sleep(20);

      document.querySelector(`[aria-controls="gm-#terms.settings#-tab"]`).click(); // Open GM Settings page

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
            name: '#ootb.settings.items.experimental_features.title#',
            description: '#ootb.settings.items.experimental_features.subtext#'
          },

          {
            name: '#ootb.settings.items.utilities.title#',
            description: '#ootb.settings.items.utilities.subtext#'
          },

          {
            name: '#ootb.settings.items.tweaks.title#',
            description: '#ootb.settings.items.tweaks.subtext#'
          }
        ]
      }),

      React.createElement(Header, {
        className: "header-2MiVco",

        size: Header.Sizes.SIZE_24
      }, '#ootb.settings.text.main#'),

      React.createElement(Text, {
        className: "byline-3REiHf",

        size: Text.Sizes.SIZE_16,
        color: Text.Colors.HEADER_SECONDARY
      }, '#ootb.settings.text.subtext#')
    )
  });
};

export const community = async () => {
  const ModulesPreview = (await import('./modulesPreview')).default();

  const { React } = goosemod.webpackModules.common;

  const Header = goosemod.webpackModules.find((x) => x.displayName === 'Header' && x.Sizes);
  const Text = goosemod.webpackModules.findByDisplayName('Text');

  goosemod.webpackModules.find((x) => x.show && x.show.toString().includes('confirmText')).show({
    className: 'gm-ootb-modal',

    title: '#terms.community#',

    confirmText: '#ootb.community.confirm#',

    onConfirm: () => {
      window.open('https://goosemod.com/discord');
    },

    body: React.createElement('div', {
      className: 'container-1rn8Cv'
    },
      React.createElement(ModulesPreview, {
        modules: [
          {
            name: '#ootb.community.items.ask_questions.title#',
            description: '#ootb.community.items.ask_questions.subtext#'
          },

          {
            name: '#ootb.community.items.news.title#',
            description: '#ootb.community.items.news.subtext#'
          },

          {
            name: '#ootb.community.items.get_involved.title#',
            description: '#ootb.community.items.get_involved.subtext#'
          }
        ]
      }),

      React.createElement(Header, {
        className: "header-2MiVco",

        size: Header.Sizes.SIZE_24
      }, '#ootb.community.text.main#'),

      React.createElement(Text, {
        className: "byline-3REiHf",

        size: Text.Sizes.SIZE_16,
        color: Text.Colors.HEADER_SECONDARY
      }, '#ootb.community.text.subtext#')
    )
  });
};

export const start = async () => {
  const ModulesPreview = (await import('./modulesPreview')).default();

  const { React } = goosemod.webpackModules.common;

  const Header = goosemod.webpackModules.find((x) => x.displayName === 'Header' && x.Sizes);
  const Text = goosemod.webpackModules.findByDisplayName('Text');

  goosemod.webpackModules.find((x) => x.show && x.show.toString().includes('confirmText')).show({
    className: 'gm-ootb-modal',

    title: 'GooseMod',

    confirmText: '#ootb.start.confirm#',
    cancelText: '#ootb.start.cancel#',

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
            name: '#terms.store.store#',
            description: '#ootb.start.items.store.subtext#'
          },

          {
            name: '#terms.settings#',
            description: '#ootb.start.items.settings.subtext#'
          },

          {
            name: '#terms.community#',
            description: '#ootb.start.items.community.subtext#'
          }
        ]
      }),

      React.createElement(Header, {
        className: "header-2MiVco",

        size: Header.Sizes.SIZE_24
      }, '#ootb.start.text.main#'),

      React.createElement(Text, {
        className: "byline-3REiHf",

        size: Text.Sizes.SIZE_16,
        color: Text.Colors.HEADER_SECONDARY
      }, '#ootb.start.text.subtext#')
    )
  });
};