import _Divider from './divider';

export default () => {
const { React } = goosemod.webpackModules.common;

const Divider = _Divider();

const Button = goosemod.webpackModules.findByProps('Sizes', 'Colors', 'Looks', 'DropdownSizes');

const Markdown = goosemod.webpackModules.findByDisplayName('Markdown');

const FormItem = goosemod.webpackModules.findByDisplayName('FormItem');
const FormText = goosemod.webpackModules.findByDisplayName('FormText');

const Flex = goosemod.webpackModules.findByDisplayName('Flex');
const Margins = goosemod.webpackModules.findByProps('marginTop20', 'marginBottom20');

const FormClasses = goosemod.webpackModules.findByProps('title', 'dividerDefault');
const FormTextClasses = goosemod.webpackModules.findByProps('formText', 'placeholder');

return class TextAndButton extends React.PureComponent {
  render() {
    return React.createElement(FormItem, {
        className: [Flex.Direction.VERTICAL, Flex.Justify.START, Flex.Align.STRETCH, Flex.Wrap.NO_WRAP, Margins.marginBottom20].join(' '),
      },

      React.createElement('div', {
          style: {
            display: 'flex',
            justifyContent: 'space-between'
          }
        },

        React.createElement('div', {},
          React.createElement('div', {
              className: FormClasses.labelRow,
              style: {
                marginBottom: '4px'
              }
            },

            React.createElement('label', {
              class: FormClasses.title
            }, this.props.text)
          ),

          React.createElement(FormText, {
            className: FormTextClasses.description
          },
            React.createElement(Markdown, {
              className: 'gm-settings-note-markdown'
            }, this.props.subtext || '')
          )
        ),

        React.createElement(Button, {
            color: this.props.danger ? Button.Colors.RED : Button.Colors.BRAND,
            disabled: this.props.disabled,

            onClick: () => this.props.onclick()
          },

          this.props.buttonText
        ),
      ),

      React.createElement(Divider)
    );
  }
}
};