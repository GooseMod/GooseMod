const { React } = goosemod.webpackModules.common;

const FormDivider = goosemod.webpackModules.findByDisplayName('FormDivider');
const SettingsFormClasses = goosemod.webpackModules.findByProps('dividerDefault', 'titleDefault');

export default class Divider extends React.PureComponent {
  render() {
    return React.createElement(FormDivider, {
      className: SettingsFormClasses.dividerDefault
    });
  }
}