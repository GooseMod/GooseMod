const { React } = goosemod.webpackModules.common;

const SwitchItem = goosemod.webpackModules.findByDisplayName('SwitchItem');

const Text = goosemod.webpackModules.findByDisplayName('Text');
const Markdown = goosemod.webpackModules.findByDisplayName('Markdown');

const Science = goosemod.webpackModules.findByDisplayName('Science');


export default class Toggle extends React.Component {
  constructor(props) {
    const originalHandler = props.onToggle;
    props.onChange = (e) => {
      originalHandler(e);

      this.props.value = e;
      this.forceUpdate();
    };
    
    if (props.experimental) {
      props.text = [
        React.createElement(Science, {
          width: 22,
          height: 22,

          className: 'gm-experimental-label-icon'
        }),

        React.createElement('span', {
          className: 'gm-experimental-label-text'
        }, props.text)
      ];
    }

    super(props);
  }

  render() {
    return React.createElement(SwitchItem, {
      value: this.props.isToggled(),
      note: React.createElement(Markdown, {
        className: 'gm-settings-note-markdown'
      }, this.props.subtext),

      onChange: this.props.onChange
    }, this.props.text);
  }
}