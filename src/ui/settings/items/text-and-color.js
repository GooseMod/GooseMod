const { React, constants: { DEFAULT_ROLE_COLOR, ROLE_COLORS } } = goosemod.webpackModules.common;

import Divider from './divider';

const FormItem = goosemod.webpackModules.findByDisplayName('FormItem');
const FormTitle = goosemod.webpackModules.findByDisplayName('FormTitle');

const Margins = goosemod.webpackModules.findByProps('marginTop20', 'marginBottom20');
const TitleClasses = goosemod.webpackModules.findByProps('defaultMarginh5');

const colorToHexString = (dColor) => {
  const r = ((dColor & 0xff0000) >>> 16).toString(16).padStart(2, '0');
  const g = ((dColor & 0xff00) >>> 8).toString(16).padStart(2, '0');
  const b = (dColor & 0xff).toString(16).padStart(2, '0');

  return '#' + r + g + b;
};

const hexStringToColor = (hex) => {
  if (!hex || hex.length !== 7) return undefined;

  return parseInt(hex.slice(1), 16);
};

export default class TextAndColor extends React.PureComponent {
  constructor(props) {
    props.default = hexStringToColor((props.initialValue || (() => {}))()) || 0;
    props.value = props.default;

    super(props)
  }

  render() {
    const ColorPicker = goosemod.webpackModules.find((x) => x.default?.displayName === 'ColorPicker');

    return React.createElement(FormItem, {
        className: [Margins.marginBottom20].join(' '),
      },

      React.createElement(FormTitle, {
        tag: 'h5',
  
        className: (this.props.i !== 0 ? Margins.marginTop20 + ' ' : '') + TitleClasses.defaultMarginh5
      }, this.props.text),

      React.createElement(ColorPicker.default, {
        colors: ROLE_COLORS,
        defaultColor: this.props.default || DEFAULT_ROLE_COLOR,

        disabled: false,

        value: this.props.value,
        customColor: null,

        renderDefaultButton: (props) => React.createElement(ColorPicker.DefaultColorButton, props),

        renderCustomButton: (props) => React.createElement(ColorPicker.CustomColorButton, props),
        customPickerPosition: 'bottom',

        onChange: (x) => {
          console.log('onChange', x);

          this.props.value = x;

          this.forceUpdate();

          this.props.oninput(colorToHexString(x));
        }
      }),

      React.createElement(Divider)
    );
  }
}