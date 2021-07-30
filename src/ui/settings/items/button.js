export default () => {
const { React } = goosemod.webpackModules.common;

const Button = goosemod.webpackModules.findByProps('Sizes', 'Colors', 'Looks', 'DropdownSizes');


return class Button extends React.PureComponent {
  render() {
    return React.createElement(Button, {
      color: Button.Colors.BRAND,
      size: Button.Sizes.SMALL,

      disabled: this.props.disabled,

      onClick: () => this.props.onclick()
    },

    this.props.text
    );
  }
}
};