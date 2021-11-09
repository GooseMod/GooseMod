export default async (goosemodScope) => {
  const { React, ReactDOM } = goosemodScope.webpackModules.common;

  const ConnectedPrivateChannelsList = goosemodScope.webpackModules.find((x) => x.default && x.default.displayName === 'ConnectedPrivateChannelsList');

  const ListSectionItem = goosemodScope.webpackModules.findByDisplayName('ListSectionItem');
  const { LinkButton } = goosemodScope.webpackModules.findByProps('LinkButton');

  const LinkButtonClasses = goosemodScope.webpackModules.findByProps('selected', 'wrappedName');
  const ChannelLinkButtonClasses = goosemodScope.webpackModules.findByProps('channel', 'linkButtonIcon');
  const HeaderClasses = goosemodScope.webpackModules.findByProps('headerText', 'privateChannelsHeaderContainer');
  const IconClasses = goosemodScope.webpackModules.findByProps('icon', 'iconBadge', 'title');
  const ScrollerClasses = goosemodScope.webpackModules.findByProps('scrollerBase', 'auto', 'thin');

  const homeIcons = {
    themes: React.createElement(goosemodScope.webpackModules.findByDisplayName('Eye'), {
      width: 24,
      height: 24
    }),

    plugins: React.createElement(goosemodScope.webpackModules.findByDisplayName('InlineCode'), {
      width: 24,
      height: 24
    }),

    snippets: React.createElement(goosemodScope.webpackModules.findByDisplayName('Pictures'), {
      width: 24,
      height: 24
    }),

    expandable: React.createElement(goosemod.webpackModules.findByDisplayName('DropdownArrow'), {
      className: `${IconClasses.icon}`,

      width: 24,
      height: 24
    })
  };

  const Header = (await import('./header')).default();

  const LoadingPopout = goosemodScope.webpackModules.findByDisplayName('LoadingPopout');

  const makeHeader = (icon, title, id) => React.createElement(Header, {
    icon,
    title,
    id
  });

  const makeContent = (isLibrary, content) => React.createElement('div', {
    className: !isLibrary ? `${ScrollerClasses.auto}` : '',
    id: 'gm-settings-inject',

    style: {
      padding: '22px',
      backgroundColor: 'var(--background-primary)',

      height: '100%',
      overflow: !isLibrary ? 'hidden scroll' : ''
    }
  }, content);

  const makePage = (icon, title, id, content) => React.createElement('div', {
    style: {
      height: '100%',
      overflow: 'hidden'
    }
  },
    makeHeader(icon, title, id),

    makeContent(false, content)
  );

  const RoutingUtils = goosemodScope.webpackModules.findByProps('transitionTo');

  const findClassInParentTree = (el, className, depth = 0) => {
    if (depth > 5) return false;

    const parentEl = el.parentElement;
    return (parentEl.classList.contains(className) && parentEl) || findClassInParentTree(parentEl, className, depth + 1);
  };

  let expanded = goosemodScope.settings.gmSettings.collapsiblehome ? (goosemod.storage.get('goosemodHomeExpanded') || true) : true;

  let settings = {
    plugins: goosemodScope.settings.items.find((x) => x[1] === '#terms.store.plugins#'),
    themes: goosemodScope.settings.items.find((x) => x[1] === '#terms.store.themes#'),
    snippets: goosemodScope.settings.items.find((x) => x[1] === '#terms.store.snippets#')
  };

  let contents = {
    plugins: goosemodScope.settings._createItem(settings.plugins[1], settings.plugins[2], false),
    themes: goosemodScope.settings._createItem(settings.themes[1], settings.themes[2], false),
    snippets: goosemodScope.settings._createItem(settings.snippets[1], settings.snippets[2], false)
  };

  const handleItemClick = (title, type) => {
    const parentEl = [...document.querySelector(`.content-98HsJk`).children].find((x, i) => i !== 0 && !x.classList.contains('erd_scroll_detection_container'));

    for (const x of document.querySelector(`.scroller-1JbKMe`).children[0].children) {
      if (!x.className?.replace) continue;
      x.className = x.className.replace(LinkButtonClasses.selected, LinkButtonClasses.clickable);
    }

    setTimeout(() => {
      const buttonEl = document.getElementById(`gm-home-${type}`);
      buttonEl.className = buttonEl.className.replace(LinkButtonClasses.clickable, LinkButtonClasses.selected);
    }, 0);

    const contentCards = type !== 'snippets' && Array.isArray(contents[type].props.children) ? contents[type].props.children.filter((x) => x.props.type === 'card').length : 0;
    const expectedModuleCount = type !== 'snippets' ? goosemodScope.moduleStoreAPI.modules.filter((x) => type === 'plugins' ? !x.tags.includes('theme') : x.tags.includes('theme')).length : 0;

    if (contentCards !== expectedModuleCount || goosemodScope.settings[`regen${type}`]) { // If amount of cards in generated React content isn't the same as amount of modules in Store
      delete goosemodScope.settings[`regen${type}`];

      contents[type] = React.createElement('div', { // Show loading indicator whilst wait
        className: 'gm-store-loading-container'
      },
        React.createElement(LoadingPopout)
      );

      (async () => {
        if (type !== 'snippets' && settings[type][2].filter((x) => x.type === 'card').length !== expectedModuleCount) { // Update store settings if card counts mismatch
          await goosemodScope.moduleStoreAPI.updateStoreSetting();
        }

        contents[type] = goosemodScope.settings._createItem(settings[type][1], settings[type][2], false); // Generate React content

        document.querySelector(`#gm-home-${type}`).click();
      })();
    }


    if (parentEl.children.length === 1) {
      ReactDOM.render(makePage(homeIcons[type], title, type, contents[type]), parentEl.children[0]);
    }
    
    if (parentEl.children.length === 2 || parentEl.children.length === 3) {
      let indexOffset = parentEl.children.length - 2;

      // Library has jank scroll elements so implement edge case
      const isLibrary = parentEl.children[indexOffset + 1].classList.contains('stickyScroller-24zUyY');
      if (isLibrary) indexOffset = 0;

      parentEl.children[indexOffset + 0].className = '';
      ReactDOM.render(makeHeader(homeIcons[type], title, type), parentEl.children[indexOffset + 0]);
      
      if (indexOffset !== 0 && parentEl.children[indexOffset + 1].children[1]) {
        parentEl.children[indexOffset + 1].children[1].style.display = 'none';
      }

      if (isLibrary) indexOffset = 1;

      ReactDOM.render(makeContent(isLibrary, contents[type]), indexOffset !== 0 ? parentEl.children[indexOffset + 1].children[0] : parentEl.children[indexOffset + 1]);
    }

    if (goosemodScope.ootb.enabled && goosemodScope.ootb.todo.includes(type)) {
      goosemodScope.ootb[type]();

      goosemodScope.ootb.done(type);
    }
  };
  
  const snippetsEnabled = goosemodScope.settings.gmSettings.snippets;

  goosemodScope.settingsUninjects.push(goosemodScope.patcher.patch(ConnectedPrivateChannelsList, 'default', (_args, res) => {
    const newChanges = res.props.children.length === undefined;

    if (newChanges) {
      if (res.props.children.props.children.slice(3).find((x) => x?.toString()?.includes('GooseMod'))) return;
    } else {
      if (res.props.children.slice(3).find((x) => x?.toString()?.includes('GooseMod'))) return;
    }

    const itemWrapper = (el) => newChanges ? el : () => el;

    setTimeout(() => {
      document.querySelector(`.scroller-1JbKMe`).addEventListener('click', (e) => {
        const buttonEl = findClassInParentTree(e.target, ChannelLinkButtonClasses.channel);
        if (buttonEl && !buttonEl.id.startsWith('gm-home-')) {
          document.querySelectorAll('[id^="gm-home-"]').forEach((x) => x.className = x.className.replace(LinkButtonClasses.selected, LinkButtonClasses.clickable)); 

          setTimeout(() => {
            if (document.getElementById(`gm-settings-inject`) !== null) {
              RoutingUtils.transitionTo('/invalid');
              RoutingUtils.back();
            }
          }, 1);
        }
      });
    }, 10);

    res.props.children.props.children.push(
    itemWrapper(React.createElement(ListSectionItem, {
      className: HeaderClasses.privateChannelsHeaderContainer
    },
      React.createElement('span', {
        className: HeaderClasses.headerText
      }, 'GooseMod'),

      goosemodScope.settings.gmSettings.collapsiblehome ? React.createElement('div', {
        className: `${HeaderClasses.privateChannelRecipientsInviteButtonIcon} ${IconClasses.iconWrapper} ${IconClasses.clickable}`,

        style: {
          transform: `rotate(${expanded ? '0' : '-90'}deg)`,
          width: '22px',

          left: expanded ? '0px' : '-2px',
          top: expanded ? '-6px' : '-2px'
        },

        onClick: () => {
          expanded = !expanded;
          goosemod.storage.set('goosemodHomeExpanded', expanded);

          // Force update sidebar (jank DOM way)
          document.querySelector(`.scroller-1JbKMe`).dispatchEvent(new Event('focusin'));
          document.querySelector(`.scroller-1JbKMe`).dispatchEvent(new Event('focusout'));
        }
      },
        homeIcons.expandable
      ) : null
    )),

    itemWrapper(React.createElement(LinkButton, {
      style: {
        display: expanded || document.querySelector('.title-29uC1r')?.textContent === '#terms.store.themes#' ? 'block' : 'none'
      },

      icon: () => homeIcons.themes,
      onClick: () => handleItemClick('#terms.store.themes#', 'themes'),

      id: 'gm-home-themes',

      text: '#terms.store.themes#',

      selected: false
    })),

    itemWrapper(React.createElement(LinkButton, {
      style: {
        display: expanded || document.querySelector('.title-29uC1r')?.textContent === '#terms.store.plugins#' ? 'block' : 'none'
      },

      icon: () => homeIcons.plugins,
      onClick: () => handleItemClick('#terms.store.plugins#', 'plugins'),

      id: 'gm-home-plugins',

      text: '#terms.store.plugins#',

      selected: false
    })),

    snippetsEnabled ? itemWrapper(React.createElement(LinkButton, {
      style: {
        display: expanded || document.querySelector('.title-29uC1r')?.textContent === '#terms.store.snippets#' ? 'block' : 'none'
      },

      icon: () => homeIcons.snippets,
      onClick: () => handleItemClick('#terms.store.snippets#', 'snippets'),

      id: 'gm-home-snippets',

      text: '#terms.store.snippets#',

      selected: false
    })) : null
    );
  }));

  // If home currently open, force update sidebar via routing
  if (document.querySelector(`.privateChannels-1nO12o`)) {
    RoutingUtils.transitionTo('/invalid');
    RoutingUtils.back();
  }

  (async () => { // Pre-generate contents with cached modules
    // Make store setting with cached modules whilst waiting for hotupdate from repos
    await goosemodScope.moduleStoreAPI.updateStoreSetting();

    for (const type of ['themes', 'plugins']) {
      contents[type] = goosemodScope.settings._createItem(settings[type][1], settings[type][2], false); // Generate React contents
    }

    if (!snippetsEnabled) return;

    const snippetsLoaded = (JSON.parse(goosemod.storage.get('goosemodSnippets')) || {});

    for (const id in snippetsLoaded) {
      const css = snippetsLoaded[id];

      snippetsLoaded[id] = document.createElement('style');

      snippetsLoaded[id].appendChild(document.createTextNode(css));

      document.body.appendChild(snippetsLoaded[id]);
    }

    const snippetsLoad = async (channelId, label) => {
      const { fetchMessages } = goosemodScope.webpackModules.findByProps('fetchMessages', 'sendMessage');
      const { getRawMessages } = goosemodScope.webpackModules.findByProps('getMessages');
      const { getChannel, hasChannel } = goosemodScope.webpackModules.findByProps('getChannel', 'getDMFromUserId');
  
      if (!hasChannel(channelId)) return;

      await fetchMessages({ channelId: channelId }); // Load messages
  
      const channel = getChannel(channelId);
      const messages = Object.values(getRawMessages(channelId))
        .filter((x) => x.content.includes('\`\`\`css') && // Make sure it has CSS codeblock
          !x.message_reference && // Exclude replies
          !x.content.includes('quick CSS') && // Exclude PC / BD specific snippets
          !x.content.includes('Theme Toggler')
        ).sort((a, b) => (b.attachments.length + b.embeds.length) - (a.attachments.length + a.embeds.length)); // Bias to favour images so we can have previews first
  
      const settingItem = goosemodScope.settings.items.find((x) => x[1] === '#terms.store.snippets#');
  
      settingItem[2].push(
        {
          type: 'store-header',
          text: label
        },
        ...messages.map((x) => ({
          type: 'card',
  
          tags: [ x.id ],
          lastUpdated: 0,

          discordMessage: {
            guild: channel.guild_id,
            channel: channel.id,
            message: x.id
          },
  
          images: [ x.attachments?.[0]?.proxy_url || x.embeds?.[0]?.thumbnail?.proxy_url ].filter((x) => x),
  
          name: '', // No name makes subtext main content (not gray)
          author: [
            {
              name: x.author.username,
              id: x.author.id,
              avatar: x.author.avatar
            }
          ],
  
          subtext: x.content.replace(/```css(.*)```/gs, ''), // Only context / text without code
  
          buttonText: snippetsLoaded[x.id] ? '#terms.remove#' : '#terms.add#',
          buttonType: snippetsLoaded[x.id] ? 'danger' : 'brand',

          onclick: () => {
            const cardSet = settingItem[2].find((y) => y.tags?.includes(x.id));
            const cardEl = document.querySelector(`[class*="${x.id}"]`);
            const buttonEl = cardEl.querySelector(`button`);
  
            goosemodScope.settings.regensnippets = true;

            if (snippetsLoaded[x.id]) { // Remove
              snippetsLoaded[x.id].remove();

              delete snippetsLoaded[x.id];

              buttonEl.className = buttonEl.className.replace('lookOutlined-3sRXeN colorRed-1TFJan', 'lookFilled-1Gx00P colorBrand-3pXr91');
              buttonEl.textContent = '#terms.add#';

              cardSet.buttonText = '#terms.add#';
              cardSet.buttonType = 'brand';
            } else { // Add
              snippetsLoaded[x.id] = document.createElement('style');

              snippetsLoaded[x.id].appendChild(document.createTextNode(/```css(.*)```/s.exec(x.content)[1]));

              document.body.appendChild(snippetsLoaded[x.id]);

              buttonEl.className = buttonEl.className.replace('lookFilled-1Gx00P colorBrand-3pXr91', 'lookOutlined-3sRXeN colorRed-1TFJan');
              buttonEl.textContent = '#terms.remove#';

              cardSet.buttonText = '#terms.remove#';
              cardSet.buttonType = 'danger';
            }

            const toSave = Object.assign({}, snippetsLoaded);

            for (const id in toSave) {
              toSave[id] = toSave[id].textContent;
            }

            goosemod.storage.set('goosemodSnippets', JSON.stringify(toSave));
          },

          showToggle: false, // No toggling snippets as overcomplex for small snippets
          isToggled: () => false
        }))
      );
    };

    await snippetsLoad('755005803303403570', 'Powercord CSS Snippets');
    await snippetsLoad('836694789898109009', 'BetterDiscord CSS Snippets');
    await snippetsLoad('449569809613717518', 'Black Box CSS Snippets');

    contents['snippets'] = goosemodScope.settings._createItem(settings['snippets'][1], settings['snippets'][2], false);
  })();
};