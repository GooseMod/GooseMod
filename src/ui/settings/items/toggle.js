const { React } = goosemod.webpackModules.common;

const SwitchItem = goosemod.webpackModules.findByDisplayName('SwitchItem');

const Markdown = goosemod.webpackModules.findByDisplayName('Markdown');

const Tooltip = goosemod.webpackModules.findByDisplayName('Tooltip');
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
        React.createElement(Tooltip, {
          position: 'top',
          color: 'primary',

          text: 'Experimental',
        }, ({
          onMouseLeave,
          onMouseEnter
        }) =>
          React.createElement(Science, {
            width: 22,
            height: 22,

            className: 'gm-experimental-label-icon',

            onMouseLeave,
            onMouseEnter
          })
        ),

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