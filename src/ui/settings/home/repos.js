export default async () => {
  const { React } = goosemod.webpackModules.common;

  const SwitchItem = goosemod.webpackModules.findByDisplayName('SwitchItem');
  
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
            width: '100px',

            position: 'absolute',
            right: '108px',
            marginTop: '33px'
          },

          color: ButtonClasses["colorPrimary"],
          size: ButtonClasses["sizeSmall"],

          onClick: this.props.buttonOpenLink
        }, "#terms.openLink#"),

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
        }, '#terms.remove#'),

        React.createElement(SwitchItem, {
          ...this.props
        })
      );
    }
  }

  let modalCloseHandler = undefined;
  const updateAfterChange = async () => {
    await goosemod.moduleStoreAPI.updateModules();

    await goosemod.moduleStoreAPI.updateStoreSetting();

    document.querySelector(`.selected-aXhQR6`).click();
  };

  const restartModal = async () => {
    modalCloseHandler();

    await updateAfterChange();

    openReposModal();
  };

  const { Button } = goosemod.webpackModules.findByProps('Button');
  const ButtonClasses = goosemod.webpackModules.findByProps('button', 'colorRed');

  const ModalStuff = goosemod.webpackModules.findByProps('ModalRoot');
  const ChangelogModalClasses = goosemod.webpackModules.findByProps('socialLink', 'date');

  const Header = goosemod.webpackModules.findByDisplayName('LegacyHeader');
  const Text = goosemod.webpackModules.findByDisplayName('Text');

  const { openModal } = goosemod.webpackModules.findByProps('openModal', 'updateModal');

  const Flex = goosemod.webpackModules.findByDisplayName('Flex');
  const TextInput = goosemod.webpackModules.findByDisplayName('TextInput');

  const Tooltip = goosemod.webpackModules.findByDisplayName('Tooltip');
  const FlowerStar = goosemod.webpackModules.findByDisplayName('FlowerStar');

  const Verified = goosemod.webpackModules.findByDisplayName('Verified');
  // const Help = goosemod.webpackModules.findByDisplayName('Help');
  const Alert = goosemod.webpackModules.findAll((x) => x.displayName === 'Alert').pop(); // Discord has 2 components with "Alert" displayName

  const openReposModal = () => {
    const repoEls = [];
    let repoInd = 0;

    for (const repo of goosemod.moduleStoreAPI.repos) {
      const children = [
        repo.meta.name
      ];

      if (repo.pgp?.trustState) {
        let tooltip = '';
        let icon = null;

        switch (repo.pgp.trustState) {
          case 'trusted':
            tooltip = '#store.pgp.verified#';

            icon = React.createElement(Verified, {
              className: "icon-1ihkOt"
            });

            break;

          case 'untrusted':
            tooltip = '#store.pgp.untrusted#';

            icon = React.createElement(Alert, {
              className: "icon-1ihkOt"
            });

            break;

          case 'unknown':
            tooltip = '#store.pgp.unknown#';

            icon = React.createElement(Alert, {
              className: "icon-1ihkOt"
            });

            break;
        }

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

          text: tooltip
        }, ({
          onMouseLeave,
          onMouseEnter
        }) =>
          React.createElement(FlowerStar, {
            className: `gm-repos-modal-icon-${icon.type.displayName}`,
            'aria-label': tooltip,

            onMouseEnter,
            onMouseLeave
          },
            icon
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

        buttonOpenLink: () => {
          window.open(repo.url);
        },

        buttonOnClick: async () => {
          goosemod.moduleStoreAPI.repos.splice(goosemod.moduleStoreAPI.repos.indexOf(repo), 1);

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
          React.createElement(Flex.Child, {
            basis: 'auto',
            grow: 1,
            shrink: 1,
            wrap: false,
          },
            React.createElement(Header, {
              tag: 'h2',
              size: Header.Sizes.SIZE_20
            }, '#terms.store.repos#'),

            React.createElement(Text, {
              size: Text.Sizes.SIZE_12,
              className: ChangelogModalClasses.date
            },
              goosemod.moduleStoreAPI.modules.filter((x) => x.tags.includes('theme')).length, ' Themes', ', ',
              goosemod.moduleStoreAPI.modules.filter((x) => !x.tags.includes('theme')).length, ' Plugins', ', ',
              Object.keys(goosemod.moduleStoreAPI.modules.reduce((acc, x) => { let a = x.authors; if (!a.forEach) a = [ a ]; a.forEach((y) => acc[y.n || y.match(/(.*) \(([0-9]{17,18})\)/)?.[1] || y] = true); return acc; }, {})).length, ' Developers'
            )
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
                let resp = {};
                try {
                  resp = await (await fetch(currentNewRepoInput)).json();
                } catch (e) {
                }

                if (resp.meta?.name === undefined) {
                  goosemod.showToast('#toasts.add_repo.invalid_repo.text#', { type: 'error', timeout: 5000, subtext: '#toasts.add_repo.invalid_repo.subtext#' });

                  return;
                }

                const confirmExternal = confirm('#modals.external_repo_security.main#');
                if (!confirmExternal) {
                  goosemod.showToast('#toasts.add_repo.cancelled.text#', { type: 'danger', timeout: 5000, subtext: '#toasts.add_repo.cancelled.reasons.refused#' });

                  return;
                }

                const repo = {
                  url: currentNewRepoInput,
                  meta: resp.meta,
                  enabled: true
                };

                const pgpResult = await goosemod.moduleStoreAPI.verifyPgp(repo, false);

                if (pgpResult.trustState === 'untrusted') { // Refuse untrusted (PGP fail)
                  goosemod.showToast('#toasts.add_repo.cancelled.text#', { type: 'danger', timeout: 5000, subtext: '#toasts.add_repo.cancelled.reasons.pgp#' });

                  return;
                }

                if (pgpResult.trustState !== 'trusted' && !confirm(`#modals.external_repo_security.bad_pgp#`)) { // Warn again with no PGP
                  goosemod.showToast('#toasts.add_repo.cancelled.text#', { type: 'danger', timeout: 5000, subtext: '#toasts.add_repo.cancelled.reasons.refused#' });

                  return;
                }


                goosemod.moduleStoreAPI.repos.push(repo);

                restartModal();
              }
            }, '#terms.add#')
          )
        )
      );
    });
  };

  openReposModal();
};
