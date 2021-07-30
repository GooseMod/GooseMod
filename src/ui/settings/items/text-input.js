import _Divider from './divider';

export default () => {
const { React } = goosemod.webpackModules.common;

const Divider = _Divider;

const FormItem = goosemod.webpackModules.findByDisplayName('FormItem');
const FormText = goosemod.webpackModules.findByDisplayName('FormText');
const TextInput = goosemod.webpackModules.findByDisplayName('TextInput');

const Flex = goosemod.webpackModules.findByDisplayName('Flex');
const Margins = goosemod.webpackModules.findByProps('marginTop20', 'marginBottom20');
const FormClasses = goosemod.webpackModules.findByProps('formText', 'description');


return class TextInputGM extends React.PureComponent {
  render() {
    return React.createElement(FormItem, {
        title: this.props.text,
        className: [Flex.Direction.VERTICAL, Flex.Justify.START, Flex.Align.STRETCH, Flex.Wrap.NO_WRAP, Margins.marginBottom20].join(' ')
      },

      React.createElement(TextInput, {
        onChange: (x) => {
          this.props.oninput(x);
        },
        defaultValue: this.props.initialValue ? this.props.initialValue() : ''
      }),

      this.props.subtext && React.createElement(FormText, {
        className: [FormClasses.description, Margins.marginTop8].join(' ')
      }, this.props.subtext),

      React.createElement(Divider)
    );
  }
}
};