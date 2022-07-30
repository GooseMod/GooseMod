export default () => {
const { React } = goosemod.webpackModules.common;
const SimpleTooltip = goosemod.patcher.simpleTooltip();

const rtf = new Intl.RelativeTimeFormat("en", {
  localeMatcher: "best fit", // other values: "lookup"
  numeric: "auto", // other values: "auto"
  style: "long", // other values: "short" or "narrow"
});

const Button = goosemod.webpackModules.findByProps('Sizes', 'Colors', 'Looks', 'DropdownSizes');
const Switch = goosemod.webpackModules.findByDisplayName('Switch');

const Markdown = goosemod.webpackModules.find((x) => x.displayName === 'Markdown' && x.rules);
const FormText = goosemod.webpackModules.findByDisplayName('FormText');

const FormTextClasses = goosemod.webpackModules.findByProps('formText', 'placeholder');
const FormClasses = goosemod.webpackModules.findByProps('title', 'dividerDefault');

const ModalHandler = goosemod.webpackModules.findByProps('openModal', 'updateModal');
const SmallMediaCarousel = goosemod.webpackModules.findByDisplayName('SmallMediaCarousel');

const Discord = goosemod.webpackModules.findByDisplayName('Discord');

// Badge icons
const Clock = goosemod.webpackModules.findByDisplayName('Clock');
const Info = goosemod.webpackModules.findByDisplayName('Info');


const prettyAgo = (timestamp) => {
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];

  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  const interval = intervals.find(i => i.seconds < seconds);
  const count = Math.floor(seconds / interval.seconds);

  return rtf.format(count * -1, interval.label);
};


return class Card extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    if (!this.state.renderLoaded) {
      this.state.loaded = !this.props.i;

      if (!this.state.loaded) setTimeout(() => {
        this.setState({
          loaded: true,
          renderLoaded: true
        });
      }, 10);
    } else {
      this.state.renderLoaded = false;
    }

    if (this.props.checked !== this.props.isToggled()) {
      this.props.checked = this.props.isToggled();
    }

    let forceDisplay = false;
    if (this.state.forceDisplay) {
      forceDisplay = true;

      this.state.forceDisplay = false;
      delete this.state.forceDisplay;
    }

    let { notice } = this.props;

    switch (notice) {
      case 1:
        notice = 'Other users may notice your usage';
        break;

      case 2:
        notice = 'Other users may question or judge your usage, use appropriately';
        break;
    }

    const updateSelf = () => {
      const cardEls = [...document.querySelectorAll(`.title-2dsDLn + .colorStandard-1Xxp1s`)].filter((x) => x.textContent === this.props.subtext).map((x) => x.parentElement);

      for (const x of cardEls) {
        const ret = x.__reactFiber$.return;

        ret.pendingProps = this.props;
        ret.memoizedState.renderLoaded = true;

        ret.stateNode.forceUpdate();
      }
    };

    return !this.state.loaded ? React.createElement('div', {
      className: 'gm-store-card-loading-placeholder'
    }) : React.createElement('div', {
      className: ['gm-store-card', this.props.mini ? 'gm-store-card-mini' : '', ...this.props.tags.map((x) => x.replace(/ /g, '|'))].join(' '),
      onClick: this.props.onClick,

      style: {
        display: this.props.i && !forceDisplay ? 'none' : 'block'
      }
    },

      React.createElement(SmallMediaCarousel, {
        autoplayInterval: 0,
        items: (this.props.images?.[0] ? this.props.images : [ (goosemod.settings.gmSettings.placeholderimage ? '/assets/2366391afb15ed6c2a019a0c0caa0797.svg' : 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=') ]).map((x) => ({ type: 1, src: x })),
        paused: true,

        onCurrentItemClick: () => {
          if (!this.props.images?.[0]) return; // Ignore if no images

          ModalHandler.openModal(() => React.createElement('div', {
            className: 'gm-carousel-modal'
          },
            React.createElement(SmallMediaCarousel, {
              items: this.props.images.map((x) => ({ type: 1, src: x })),
              autoplayInterval: 5000 // Time between automatically cycling to next image
            })
          ));
        }
      }),

      React.createElement('div', {
        className: [FormClasses.title, this.props.author.every((x) => !x.avatar) ? 'no-pfp' : ''].join(' '),
      },
        ...this.props.author.map((x, i) => [
          x.avatar ? React.createElement('img', {
            loading: 'lazy',
            src: `https://cdn.discordapp.com/avatars/${x.id}/${x.avatar}.png?size=32`,
            className: 'gm-store-author-pfp'
          }) : null,
          React.createElement('span', {
            className: 'gm-store-author-name'
          }, x.name),
          i !== this.props.author.length - 1 ? React.createElement('span', {
            className: FormTextClasses.description
          }, ', ') : null
        ])
      ),

      React.createElement('div', {
        className: FormClasses.title,
      }, this.props.name),

      React.createElement(FormText, {
        className: this.props.name ? FormTextClasses.description : ''
      }, React.createElement(Markdown, {
        className: 'gm-settings-note-markdown'
      }, this.props.subtext)),

      React.createElement('div', {

      },
        this.props.github ? React.createElement(SimpleTooltip, {
          text: this.props.github.stars,
          position: 'left'
        }, ({ onMouseEnter, onMouseLeave, className, text }) => React.createElement('svg', {
          width: '24',
          height: '24',
          viewBox: '0 0 24 24',
          fill: 'currentColor',

          'aria-label': text,

          onMouseEnter,
          onMouseLeave,
          className
        },
          React.createElement('path', {
            d: 'M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z'
          })
        )) : null,

        (this.props.lastUpdated || this.props.subtext2) ? React.createElement(SimpleTooltip, {
          text: (this.props.subtext2 || '') + (this.props.subtext2 && this.props.lastUpdated ? ' | ' : '') + (this.props.lastUpdated ? prettyAgo(this.props.lastUpdated * 1000) : ''),
          position: 'left'
        }, ({ onMouseEnter, onMouseLeave, className, text }) => React.createElement(Clock, {
          width: 24,
          height: 24,

          'aria-label': text,

          className,
          onMouseEnter,
          onMouseLeave
        })) : null,

        this.props.notice ? React.createElement(SimpleTooltip, {
          text: notice,
          position: 'left'
        }, ({ onMouseEnter, onMouseLeave, className, text }) => React.createElement(Info, {
          width: 24,
          height: 24,

          'aria-label': text,

          className,
          onMouseEnter,
          onMouseLeave
        })) : null
      ),

      React.createElement('div', {

      },
        React.createElement(Button, {
          color: this.props.buttonType === 'danger' ? Button.Colors.RED : Button.Colors.BRAND,
          look: Button.Looks.FILLED, // look: this.props.buttonType === 'danger' ? Button.Looks.OUTLINED : Button.Looks.FILLED,

          size: Button.Sizes.SMALL,

          onClick: () => {
            this.props.onclick();

            this.props.buttonType = this.props.buttonType === 'danger' ? '' : 'danger';
            this.props.buttonText = this.props.buttonText === '#terms.remove#' ? '#terms.install#' : '#terms.remove#';
            this.props.showToggle = !this.props.showToggle;

            updateSelf();
          }
        }, this.props.buttonText),

        this.props.github ? React.createElement(Button, {
          color: Button.Colors.PRIMARY,
          size: Button.Sizes.SMALL,

          onClick: () => {
            window.open(`https://github.com/${this.props.github.repo}`);
          }
        },
          React.createElement('svg', {
            width: '24',
            height: '24',
            viewBox: '0 0 24 24',
            fill: 'currentColor'
          },
            React.createElement('path', {
              d: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
            })
          )
        ) : null,

        this.props.discordMessage ? React.createElement(Button, {
          color: Button.Colors.GREY,
          size: Button.Sizes.SMALL,

          onClick: () => {
            const { transitionTo } = goosemod.webpackModules.findByProps('transitionTo');
            const { jumpToMessage } = goosemod.webpackModules.findByProps('jumpToMessage');

            transitionTo(`/channels/${this.props.discordMessage.guild}/${this.props.discordMessage.channel}`);
            jumpToMessage({ channelId: this.props.discordMessage.channel, messageId: this.props.discordMessage.message, flash: true });
          }
        },
          React.createElement(Discord, {
            width: '24',
            height: '24',
          })
        ) : null,

        React.createElement(Switch, {
          className: !this.props.showToggle ? 'hide-toggle' : '',

          checked: this.props.checked,
          disabled: false,

          onChange: (x) => {
            this.props.checked = !this.props.checked;

            this.state.renderLoaded = true; // Set state to fix rerendering display props
            this.state.forceDisplay = true;

            this.props.onToggle(this.props.checked);

            updateSelf();
          }
        })
      )
    );
  }
}
};