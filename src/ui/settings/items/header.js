const { React } = goosemod.webpackModules.common;

const FormTitle = goosemod.webpackModules.findByDisplayName('FormTitle');

const Margins = goosemod.webpackModules.findByProps('marginTop20', 'marginBottom20');


export default class Header extends React.PureComponent {
  render() {
    return React.createElement(FormTitle, {
      tag: 'h5',

      className: (this.props.i !== 0 ? Margins.marginTop20 + ' ' : '') + Margins.marginBottom8
    }, this.props.text);
  }
}