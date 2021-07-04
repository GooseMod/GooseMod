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

  const openReposModal = () => {
    const repoEls = [];
    let repoInd = 0;

    for (const repo of goosemod.moduleStoreAPI.repos) {
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
                let failed = false;
                try {
                  const resp = await (await fetch(currentNewRepoInput)).json();

                  failed = resp.meta?.name === undefined;
                } catch (e) {
                  failed = true;
                }

                if (failed) {
                  goosemod.showToast(`Invalid Repo`, { type: 'error', timeout: 5000, subtext: 'GooseMod Store' });

                  return;
                }

                const confirmExternal = confirm(`External repos pose security risks as they are not controlled by GooseMod developers. We are not responsible for any dangers because of external repos added by users.\n\nIf you do not trust the owner of this repo do not use it as it could compromise your Discord install.\n\nPlease confirm adding this repo by pressing OK.`);
                if (!confirmExternal) {
                  goosemod.showToast(`Cancelled Adding Repo`, { type: 'danger', timeout: 5000, subtext: 'GooseMod Store' });

                  return;
                }


                goosemod.moduleStoreAPI.repos.push({
                  url: currentNewRepoInput,
                  enabled: true
                });

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