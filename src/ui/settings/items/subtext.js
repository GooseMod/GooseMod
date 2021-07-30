export default () => {
const { React } = goosemod.webpackModules.common;

const FormText = goosemod.webpackModules.findByDisplayName('FormText');
const Markdown = goosemod.webpackModules.findByDisplayName('Markdown');

const Margins = goosemod.webpackModules.findByProps('marginTop20', 'marginBottom20');

return class Subtext extends React.PureComponent {
  render() {
    return React.createElement(FormText, {
      type: 'description',
      className: Margins.marginBottom20
    },
      React.createElement(Markdown, {
        className: 'gm-settings-note-markdown'
      }, this.props.text || '')
    );
  }
}
};