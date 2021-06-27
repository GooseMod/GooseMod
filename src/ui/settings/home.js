import sleep from '../../util/sleep';

export default (goosemodScope) => {
  const { React, ReactDOM } = goosemodScope.webpackModules.common;

  const ConnectedPrivateChannelsList = goosemodScope.webpackModules.find((x) => x.default && x.default.displayName === 'ConnectedPrivateChannelsList');

  const ListSectionItem = goosemodScope.webpackModules.findByDisplayName('ListSectionItem');
  const { LinkButton } = goosemodScope.webpackModules.findByProps('LinkButton');

  const LinkButtonClasses = goosemodScope.webpackModules.findByProps('selected', 'wrappedName');
  const ChannelLinkButtonClasses = goosemodScope.webpackModules.findByProps('channel', 'linkButtonIcon');
  const HeaderClasses = goosemodScope.webpackModules.findByProps('headerText', 'privateChannelsHeaderContainer');
  const IconClasses = goosemodScope.webpackModules.findByProps('icon', 'iconBadge', 'title');
  const ScrollerClasses = goosemodScope.webpackModules.findByProps('scrollerBase', 'auto');
  const HomeMiscClasses = goosemodScope.webpackModules.findByProps('headerBarContainer', 'pageContent');
  const SpinClasses = goosemodScope.webpackModules.findByProps('updateAvailable');

  const homeIcons = {
    themes: React.createElement(goosemodScope.webpackModules.findByDisplayName('Eye'), {
      width: 24,
      height: 24
    }),

    plugins: React.createElement(goosemodScope.webpackModules.findByDisplayName('InlineCode'), {
      width: 24,
      height: 24
    })
  };

  const UpdateIcon = React.createElement(goosemodScope.webpackModules.findByDisplayName('Retry'), {
    width: 24,
    height: 24,

    className: IconClasses.icon
  });

  const ReposIcon = React.createElement(goosemodScope.webpackModules.findByDisplayName('Cloud'), {
    width: 24,
    height: 24,

    className: IconClasses.icon
  });

  const HeaderBarContainer = goosemodScope.webpackModules.findByDisplayName('HeaderBarContainer');
  const LoadingPopout = goosemodScope.webpackModules.findByDisplayName('LoadingPopout');


  const makeHeader = (icon, title) => React.createElement(HeaderBarContainer, {
      className: HomeMiscClasses.headerBarContainer,

      isAuthenticated: true,
      transparent: false
    },

    React.createElement(HeaderBarContainer.Icon, {
      icon: () => icon,
      className: IconClasses.icon
    }),

    React.createElement(HeaderBarContainer.Title, {}, goosemodScope.i18n.goosemodStrings.settings.itemNames[title]),

    React.createElement('div', {
      className: IconClasses.toolbar,

      style: {
        position: 'absolute',
        right: '0px'
      }
    },
      React.createElement(HeaderBarContainer.Icon, {
        icon: () => UpdateIcon,

        tooltip: goosemodScope.i18n.discordStrings.STAGE_DISCOVERY_REFRESH_ICON_LABEL,

        onClick: async () => {
          const svgEl = document.querySelector(`.${IconClasses.toolbar} > [role="button"] > svg`);
          svgEl.classList.add(SpinClasses.updateAvailable);

          await goosemodScope.moduleStoreAPI.hotupdate(true);

          document.querySelector(`.selected-aXhQR6`).click();
        }
      }),
      React.createElement(HeaderBarContainer.Icon, {
        icon: () => ReposIcon,

        tooltip: goosemodScope.i18n.goosemodStrings.moduleStore.repos.repos,

        onClick: async () => {
          // const { React } = goosemodScope.webpackModules.common;
          const SwitchItem = goosemodScope.webpackModules.findByDisplayName('SwitchItem');
  
          class SwitchItemContainer extends React.Component {
            constructor(props) {
              const originalHandler = props.onChange;
              props.onChange = (e) => {
                originalHandler(e);
  
                this.props.value = e;
                this.forceUpdate();
              };
  
              super(props);
            }
  
            render() {
              //this.props._onRender(this);
              return React.createElement('div', {},
                React.createElement(Button, {
                  style: {
                    width: '92px',
                    
                    position: 'absolute',
                    right: '10px',
                    marginTop: '33px'
                  },
  
                  color: ButtonClasses['colorRed'],
                  size: ButtonClasses['sizeSmall'],
  
                  onClick: this.props.buttonOnClick
                }, goosemodScope.i18n.discordStrings.REMOVE),
  
                React.createElement(SwitchItem, {
                  ...this.props
                })
              );
            }
          }
  
          let modalCloseHandler = undefined;
          const updateAfterChange = async () => {
            await goosemodScope.moduleStoreAPI.updateModules();
  
            await goosemodScope.moduleStoreAPI.updateStoreSetting();
  
            document.querySelector(`.selected-aXhQR6`).click();
          };
  
          const restartModal = async () => {
            modalCloseHandler();
  
            await updateAfterChange();
  
            openReposModal();
          };
  
          const { Button } = goosemodScope.webpackModules.findByProps('Button');
          const ButtonClasses = goosemodScope.webpackModules.findByProps('button', 'colorRed');
  
          const ModalStuff = goosemodScope.webpackModules.findByProps('ModalRoot');
          const FormStuff = goosemodScope.webpackModules.findByProps('FormTitle');
  
          const { openModal } = goosemodScope.webpackModules.findByProps("openModal");
  
          const Flex = goosemodScope.webpackModules.findByDisplayName('Flex');
          const TextInput = goosemodScope.webpackModules.findByDisplayName('TextInput');
  
          const Tooltip = goosemodScope.webpackModules.findByDisplayName('Tooltip');
          const FlowerStar = goosemodScope.webpackModules.findByDisplayName('FlowerStar');
          const Verified = goosemodScope.webpackModules.findByDisplayName('Verified');
  
          const openReposModal = () => {
            const repoEls = [];
            let repoInd = 0;
  
            for (const repo of goosemodScope.moduleStoreAPI.repos) {
              const verified = repo.url.startsWith(`https://store.goosemod.com`);
  
              const children = [
                repo.meta.name
              ];
  
              if (verified) {
                children.unshift(React.createElement('span', {
                  style: {
                    display: 'inline-flex',
                    position: 'relative',
                    top: '2px',
                    marginRight: '4px'
                  }
                }, React.createElement(Tooltip, {
                  position: 'top',
                  color: 'primary',
  
                  text: 'GooseMod Store Repo'
                }, ({
                  onMouseLeave,
                  onMouseEnter
                }) =>
                  React.createElement(FlowerStar, {
                    className: "verified-1eC5dy background-2uufRq disableColor-2z9rkr",
                    'aria-label': 'GooseMod Store Repo',
  
                    onMouseEnter,
                    onMouseLeave
                  },
                    React.createElement(Verified, {
                      className: "icon-1ihkOt"
                    })
                  )
                )));
              }
  
              repoEls.push(React.createElement(SwitchItemContainer, {
                style: {
                  marginTop: repoInd === 0 ? '16px' : ''
                },
  
                note: repo.meta.description,
                value: repo.enabled,
  
                onChange: (e) => {
                  repo.enabled = e;
  
                  updateAfterChange();
                },
  
                buttonOnClick: async () => {
                  goosemodScope.moduleStoreAPI.repos.splice(goosemodScope.moduleStoreAPI.repos.indexOf(repo), 1);
  
                  restartModal();
                }
              }, ...children));
  
              repoInd++;
            }
  
            let currentNewRepoInput = '';
  
            openModal((e) => {
              modalCloseHandler = e.onClose;
  
              return React.createElement(ModalStuff.ModalRoot, {
                  transitionState: e.transitionState,
                  size: 'medium'
                },
                React.createElement(ModalStuff.ModalHeader, {},
                  React.createElement(FormStuff.FormTitle, { tag: 'h4' },
                    goosemodScope.i18n.goosemodStrings.moduleStore.repos.repos
                  ),
                  React.createElement('FlexChild', {
                      basis: 'auto',
                      grow: 0,
                      shrink: 1,
                      wrap: false
                    },
                    React.createElement(ModalStuff.ModalCloseButton, {
                      onClick: e.onClose
                    })
                  )
                ),
      
                React.createElement(ModalStuff.ModalContent, {},
                  ...repoEls,
                  React.createElement(Flex, {
                      style: {
                        marginBottom: '16px'
                      },
  
                      basis: 'auto',
                      grow: 1,
                      shrink: 1
                    },
  
                    React.createElement(TextInput, {
                      className: 'codeRedemptionInput-3JOJea',
                      placeholder: 'https://example.com/modules.json',
                      onChange: (e) => {
                        currentNewRepoInput = e;
                      },
                    }),
  
                    React.createElement(Button, {
                      style: {
                        width: '112px'
                      },
                      // color: ButtonClasses['colorBrand']
                      size: ButtonClasses['sizeMedium'],
                      onClick: async () => {
                        let failed = false;
                        try {
                          const resp = await (await fetch(currentNewRepoInput)).json();
  
                          failed = resp.meta?.name === undefined;
                        } catch (e) {
                          failed = true;
                        }
  
                        if (failed) {
                          goosemodScope.showToast(`Invalid Repo`, { type: 'error', timeout: 5000, subtext: 'GooseMod Store' });
  
                          return;
                        }
  
                        const confirmExternal = confirm(`External repos pose security risks as they are not controlled by GooseMod developers. We are not responsible for any dangers because of external repos added by users.\n\nIf you do not trust the owner of this repo do not use it as it could compromise your Discord install.\n\nPlease confirm adding this repo by pressing OK.`);
                        if (!confirmExternal) {
                          goosemodScope.showToast(`Cancelled Adding Repo`, { type: 'danger', timeout: 5000, subtext: 'GooseMod Store' });
  
                          return;
                        }
  
  
                        goosemodScope.moduleStoreAPI.repos.push({
                          url: currentNewRepoInput,
                          enabled: true
                        });
  
                        restartModal();
                      }
                    }, goosemodScope.i18n.discordStrings.ADD)
                  )
                )
              );
            });
          };
  
          openReposModal();
        }
      })
    )
  );

  const makeContent = (isLibrary, content) => React.createElement('div', {
    className: !isLibrary ? `${ScrollerClasses.scrollerBase} ${ScrollerClasses.auto}` : '',
    id: 'gm-settings-inject',

    style: {
      padding: '22px',
      backgroundColor: 'var(--background-primary)',

      height: '100%',
      overflow: !isLibrary ? 'hidden scroll' : ''
    }
  }, content);

  const makePage = (icon, title, content) => React.createElement('div', {
    style: {
      height: '100%',
      overflow: 'hidden'
    }
  },
    makeHeader(icon, title),

    makeContent(false, content)
  );

  const RoutingUtils = goosemodScope.webpackModules.findByProps('transitionTo');

  const findClassInParentTree = (el, className, depth = 0) => {
    if (depth > 5) return false;

    const parentEl = el.parentElement;
    return (parentEl.classList.contains(className) && parentEl) || findClassInParentTree(parentEl, className, depth + 1);
  };

  let expanded = true;

  let settings = {
    plugins: goosemodScope.settings.items.find((x) => x[1] === goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins),
    themes: goosemodScope.settings.items.find((x) => x[1] === goosemodScope.i18n.goosemodStrings.settings.itemNames.themes)
  };

  let contents = {
    plugins: goosemodScope.settings._createItem(settings.plugins[1], settings.plugins[2], false),
    themes: goosemodScope.settings._createItem(settings.themes[1], settings.themes[2], false)
  };

  const handleItemClick = (type) => {
    const parentEl = [...document.querySelector(`.content-98HsJk`).children].find((x, i) => i !== 0 && !x.classList.contains('erd_scroll_detection_container'));

    [...document.querySelector(`.scroller-1JbKMe`).children[0].children].forEach((x) => x.className = x.className?.replace(LinkButtonClasses.selected, LinkButtonClasses.clickable));

    setTimeout(() => {
      const buttonEl = document.getElementById(`gm-home-${type}`);
      buttonEl.className = buttonEl.className.replace(LinkButtonClasses.clickable, LinkButtonClasses.selected);
    }, 0);

    const contentCards = Array.isArray(contents[type].props.children) ? contents[type].props.children.filter((x) => x.props.type === 'card').length : 0;
    const expectedModuleCount = goosemodScope.moduleStoreAPI.modules.filter((x) => type === 'plugins' ? !x.tags.includes('theme') : x.tags.includes('theme')).length;

    if (contentCards !== expectedModuleCount) { // If amount of cards in generated React content isn't the same as amount of modules in Store
      contents[type] = React.createElement('div', { // Show loading indicator whilst wait
        className: 'gm-store-loading-container'
      },
        React.createElement(LoadingPopout)
      );

      (async () => {
        if (settings[type][2].filter((x) => x.type === 'card').length !== expectedModuleCount) { // Update store settings if card counts mismatch
          await goosemodScope.moduleStoreAPI.updateStoreSetting();
        }

        contents[type] = goosemodScope.settings._createItem(settings[type][1], settings[type][2], false); // Generate React content

        document.querySelector(`.selected-aXhQR6`).click();
      })();
    }


    if (parentEl.children.length === 1) {
      ReactDOM.render(makePage(homeIcons[type], type, contents[type]), parentEl.children[0]);
    }
    
    if (parentEl.children.length === 2 || parentEl.children.length === 3) {
      let indexOffset = parentEl.children.length - 2;

      // Library has jank scroll elements so implement edge case
      const isLibrary = parentEl.children[indexOffset + 1].classList.contains('stickyScroller-24zUyY');
      if (isLibrary) indexOffset = 0;

      parentEl.children[indexOffset + 0].className = '';
      ReactDOM.render(makeHeader(homeIcons[type], type), parentEl.children[indexOffset + 0]);
      
      if (indexOffset !== 0 && parentEl.children[indexOffset + 1].children[1]) {
        parentEl.children[indexOffset + 1].children[1].style.display = 'none';
      }

      if (isLibrary) indexOffset = 1;

      ReactDOM.render(makeContent(isLibrary, contents[type]), indexOffset !== 0 ? parentEl.children[indexOffset + 1].children[0] : parentEl.children[indexOffset + 1]);
    }
  };

  goosemodScope.settingsUninjects.push(goosemodScope.patcher.patch(ConnectedPrivateChannelsList, 'default', (_args, res) => {
    if (res.props.children.slice(3).find((x) => x?.toString()?.includes('GooseMod'))) return;

    setTimeout(() => {
      document.querySelector(`.scroller-1JbKMe`).addEventListener('click', (e) => {
        const buttonEl = findClassInParentTree(e.target, ChannelLinkButtonClasses.channel);
        if (buttonEl && buttonEl.textContent !== goosemodScope.i18n.goosemodStrings.settings.itemNames.themes && buttonEl.textContent !== goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins) {
          const themesEl = document.getElementById('gm-home-themes');
          themesEl.className = themesEl.className.replace(LinkButtonClasses.selected, LinkButtonClasses.clickable);

          const pluginsEl = document.getElementById('gm-home-plugins');
          pluginsEl.className = pluginsEl.className.replace(LinkButtonClasses.selected, LinkButtonClasses.clickable);

          setTimeout(() => {
            if (document.getElementById(`gm-settings-inject`) !== null) {
              RoutingUtils.transitionTo('/invalid');
              RoutingUtils.back();
            }
          }, 1);
        }
      });
    }, 10);

    res.props.children.push(
    () => React.createElement(ListSectionItem, {
      className: HeaderClasses.privateChannelsHeaderContainer
    },
      React.createElement('span', {
        className: HeaderClasses.headerText
      }, 'GooseMod'),

      React.createElement('div', {
        className: `${HeaderClasses.privateChannelRecipientsInviteButtonIcon} ${IconClasses.iconWrapper} ${IconClasses.clickable}`,

        style: {
          transform: `rotate(${expanded ? '0' : '-90'}deg)`,
          width: '22px',

          left: expanded ? '0px' : '-2px',
          top: expanded ? '-6px' : '-2px'
        },

        onClick: () => {
          expanded = !expanded;

          // Force update sidebar (jank DOM way)
          document.querySelector(`.scroller-1JbKMe`).dispatchEvent(new Event('focusin'));
          document.querySelector(`.scroller-1JbKMe`).dispatchEvent(new Event('focusout'));
        }
      },
        React.createElement(goosemodScope.webpackModules.findByDisplayName('DropdownArrow'), {
          className: `${IconClasses.icon}`,

          width: 24,
          height: 24
        })
      )
    ),

    () => React.createElement(LinkButton, {
      style: {
        display: expanded || document.querySelector('.title-29uC1r')?.textContent === goosemodScope.i18n.goosemodStrings.settings.itemNames.themes ? 'block' : 'none'
      },

      icon: () => homeIcons.themes,
      onClick: () => handleItemClick('themes'),

      id: 'gm-home-themes',

      text: goosemodScope.i18n.goosemodStrings.settings.itemNames.themes,

      selected: false
    }),

    () => React.createElement(LinkButton, {
      style: {
        display: expanded || document.querySelector('.title-29uC1r')?.textContent === goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins ? 'block' : 'none'
      },

      icon: () => homeIcons.plugins,
      onClick: () => handleItemClick('plugins'),

      id: 'gm-home-plugins',

      text: goosemodScope.i18n.goosemodStrings.settings.itemNames.plugins,

      selected: false
    }));
  }));

  // If home currently open, force update sidebar via routing
  if (document.querySelector(`.privateChannels-1nO12o`)) {
    RoutingUtils.transitionTo('/invalid');
    RoutingUtils.back();
  }

  (async () => { // Pre-generate contents with cached modules
    console.log(goosemodScope.moduleStoreAPI.modules.length);

    // Make store setting with cached modules whilst waiting for hotupdate from repos
    await goosemodScope.moduleStoreAPI.updateStoreSetting();

    for (const type of ['themes', 'plugins']) {
      contents[type] = goosemodScope.settings._createItem(settings[type][1], settings[type][2], false); // Generate React contents
    }
  })();
};