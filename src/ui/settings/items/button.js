export default () => {
const { React } = goosemod.webpackModules.common;

const ButtonProps = goosemod.webpackModules.findByProps('Sizes', 'Colors', 'Looks', 'DropdownSizes');


return class Button extends React.PureComponent {
  render() {
    return React.createElement(Button, {
      color: ButtonProps.Colors.BRAND,
      size: ButtonProps.Sizes.SMALL,

      disabled: this.props.disabled,

      onClick: () => this.props.onclick()
    },

    this.props.text
    );
  }
}
};