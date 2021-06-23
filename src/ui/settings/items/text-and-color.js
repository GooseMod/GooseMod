const { React, constants: { DEFAULT_ROLE_COLOR, ROLE_COLORS } } = goosemod.webpackModules.common;

import Divider from './divider';

const FormItem = goosemod.webpackModules.findByDisplayName('FormItem');
const FormTitle = goosemod.webpackModules.findByDisplayName('FormTitle');

const Margins = goosemod.webpackModules.findByProps('marginTop20', 'marginBottom20');
const TitleClasses = goosemod.webpackModules.findByProps('defaultMarginh5');

// https://gist.github.com/A1rPun/b650b819f70942feb324

function colorToHexString(dColor) {
  return '#' + ("000000" + (((dColor & 0xFF) << 16) + (dColor & 0xFF00) + ((dColor >> 16) & 0xFF)).toString(16)).slice(-6);
}

function hexStringToColor(hex) {
  if (!hex || hex.length !== 7) return undefined;

  var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
  return (r | g << 8 | b << 16);
}

export default class TextAndColor extends React.PureComponent {
  constructor(props) {
    props.default = hexStringToColor((props.initialValue || (() => {}))()) || 0;
    props.value = props.default;

    super(props)
  }

  render() {
    const ColorPicker = goosemod.webpackModules.findByDisplayName('ColorPicker');

    console.log(ColorPicker);

    return React.createElement(FormItem, {
        className: [Margins.marginBottom20].join(' '),
      },

      React.createElement(FormTitle, {
        tag: 'h5',
  
        className: (this.props.i !== 0 ? Margins.marginTop20 + ' ' : '') + TitleClasses.defaultMarginh5
      }, this.props.text),

      React.createElement(ColorPicker, {
        colors: ROLE_COLORS,
        defaultColor: this.props.default || DEFAULT_ROLE_COLOR,
        value: this.props.value,
        onChange: (x) => {
          console.log('onChange', x);

          this.props.value = x;

          this.props.oninput(colorToHexString(x));
        }
      }),

      React.createElement(Divider)
    );
  }
}