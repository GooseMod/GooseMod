const { React } = goosemod.webpackModules.common;

const Button = goosemod.webpackModules.findByProps('Sizes', 'Colors', 'Looks', 'DropdownSizes');
const Switch = goosemod.webpackModules.findByDisplayName('Switch');

const FormText = goosemod.webpackModules.findByDisplayName('FormText');

const FormTextClasses = goosemod.webpackModules.findByProps('formText', 'placeholder');
const FormClasses = goosemod.webpackModules.findByProps('title', 'dividerDefault');

export default class Card extends React.PureComponent {
  render() {
    if (this.props.checked !== this.props.isToggled()) {
      this.props.checked = this.props.isToggled();
    }

    return React.createElement('div', {
      className: ['gm-store-card', ...this.props.tags.map((x) => x.replace(/ /g, '|'))].join(' ')
    },

      React.createElement('div', {
        style: {
        backgroundImage: this.props.images?.length ? `url("${this.props.images[0]}")` : ''
        }
      }, this.props.images?.length ? '' : 'No Preview'),

      React.createElement('div', {
        className: [FormClasses.title, !this.props.author.includes('avatar') ? 'no-pfp' : ''].join(' '),

        ref: (ref) => {
          if (!ref) return;
          ref.innerHTML = this.props.author;
        }
      }),

      React.createElement('div', {
        className: FormClasses.title,
      }, this.props.name),

      React.createElement(FormText, {
        className: FormTextClasses.description
      }, this.props.subtext),

      React.createElement('div', {
        
      },
        React.createElement(FormText, {
          className: FormTextClasses.description
        },
          React.createElement('span', {

          }, this.props.github.stars),

          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'currentColor'
          },
            React.createElement('path', {
              d: 'M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z'
            })
          )
        ),

        React.createElement(FormText, {
          className: FormTextClasses.description
        }, this.props.subtext2)
      ),

      React.createElement('div', {

      },
        React.createElement(Button, {
          color: this.props.buttonType === 'danger' ? Button.Colors.RED : Button.Colors.BRAND,
          look: this.props.buttonType === 'danger' ? Button.Looks.OUTLINED : Button.Looks.FILLED,

          size: Button.Sizes.SMALL,

          onClick: () => {
            this.props.onclick();
          }
        }, this.props.buttonText),

        React.createElement(Button, {
          color: Button.Colors.GREY,
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
        ),

        React.createElement(Switch, {
          className: !this.props.showToggle ? 'hide-toggle' : '',

          checked: this.props.checked,
          disabled: false,

          onChange: (x) => {
            this.props.checked = !this.props.checked;

            this.forceUpdate();

            this.props.onToggle(this.props.checked);
          }
        })
      )
    );
  }
}