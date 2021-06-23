const { React } = goosemod.webpackModules.common;

const Text = goosemod.webpackModules.findByDisplayName('Text');

const HeaderClasses = goosemod.webpackModules.findByProps('pageHeader');

export default class StoreHeader extends React.PureComponent {
  render() {
    return React.createElement('div', {
      className: [HeaderClasses.headerContainer, 'gm-store-header'].join(' ')
    }, React.createElement(Text, {
        color: Text.Colors.HEADER_PRIMARY,
        size: Text.Sizes.SIZE_20,

        className: HeaderClasses.pageHeader
      }, this.props.text)
    );
  }
}