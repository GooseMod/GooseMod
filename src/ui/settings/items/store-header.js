export default () => {
const { React } = goosemod.webpackModules.common;

const Text = goosemod.webpackModules.findByDisplayName('Text');


return class StoreHeader extends React.PureComponent {
  render() {
    return React.createElement('div', {
      className: 'gm-store-header'
    }, React.createElement(Text, {
        color: Text.Colors.HEADER_PRIMARY,
        size: Text.Sizes.SIZE_20,

        className: HeaderClasses.pageHeader
      }, this.props.text)
    );
  }
}
};