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
            width: '92px',
            
            position: 'absolute',
            right: '10px',
            marginTop: '33px'
          },

          color: ButtonClasses['colorRed'],
          size: ButtonClasses['sizeSmall'],

          onClick: this.props.buttonOnClick
        }, goosemod.i18n.discordStrings.REMOVE),

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
  const FormStuff = goosemod.webpackModules.findByProps('FormTitle');

  const { openModal } = goosemod.webpackModules.findByProps("openModal");

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
            tooltip = 'PGP Verified';

            icon = React.createElement(Verified, {
              className: "icon-1ihkOt"
            });

            break;

          case 'untrusted':
            tooltip = 'PGP Untrusted';

            icon = React.createElement(Alert, {
              className: "icon-1ihkOt"
            });

            break;

          case 'unknown':
            tooltip = 'No PGP';

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
          React.createElement(FormStuff.FormTitle, { tag: 'h4' },
            goosemod.i18n.goosemodStrings.moduleStore.repos.repos
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
                  goosemod.showToast(`Invalid Repo`, { type: 'error', timeout: 5000, subtext: 'GooseMod Store' });

                  return;
                }

                const confirmExternal = confirm(`External repos pose security risks as they are not controlled by GooseMod developers. We are not responsible for any dangers because of external repos added by users.\n\nIf you do not trust the owner of this repo do not use it as it could compromise your Discord install.\n\nPlease confirm adding this repo by pressing OK.`);
                if (!confirmExternal) {
                  goosemod.showToast(`Cancelled Adding Repo`, { type: 'danger', timeout: 5000, subtext: 'Refused Security Prompt' });

                  return;
                }

                const repo = {
                  url: currentNewRepoInput,
                  meta: resp.meta,
                  enabled: true
                };

                const pgpResult = await goosemod.moduleStoreAPI.verifyPgp(repo, false);

                if (pgpResult.trustState === 'untrusted') { // Refuse untrusted (PGP fail)
                  goosemod.showToast(`Cancelled Adding Repo`, { type: 'danger', timeout: 5000, subtext: 'PGP Untrusted Failure' });

                  return;
                }

                if (pgpResult.trustState !== 'trusted' && !confirm(`This repo is not known or trusted (no PGP verification), please be extra careful. Make sure you trust the owner(s) of this repo completely.\n\nTo solve this issue ask the repo maintainer to add PGP support.\n\nPlease reconfirm adding this repo by pressing OK.`)) { // Warn again with no PGP
                  goosemod.showToast(`Cancelled Adding Repo`, { type: 'danger', timeout: 5000, subtext: 'Refused Security Prompt' });

                  return;
                }


                goosemod.moduleStoreAPI.repos.push(repo);

                restartModal();
              }
            }, goosemod.i18n.discordStrings.ADD)
          )
        )
      );
    });
  };

  openReposModal();
};