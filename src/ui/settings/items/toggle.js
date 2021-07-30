export default () => {
const { React } = goosemod.webpackModules.common;

const SwitchItem = goosemod.webpackModules.findByDisplayName('SwitchItem');

const Markdown = goosemod.webpackModules.findByDisplayName('Markdown');

const Tooltip = goosemod.webpackModules.findByDisplayName('Tooltip');
const Science = goosemod.webpackModules.findByDisplayName('Science');
const Alert = goosemod.webpackModules.findByDisplayName('InfoFilled');


return class Toggle extends React.Component {
  constructor(props) {
    const originalHandler = props.onToggle;
    props.onChange = (e) => {
      this.props.value = e;
      this.forceUpdate();

      originalHandler(e);
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

            className: 'gm-settings-label-icon',

            onMouseLeave,
            onMouseEnter
          })
        ),

        React.createElement('span', {
          className: 'gm-settings-label-text'
        }, props.text)
      ];

      props.subtext = `**Experimental:** ` + props.subtext;
    }

    if (props.debug) {
      props.text = [
        React.createElement(Tooltip, {
          position: 'top',
          color: 'primary',

          text: 'Debug',
        }, ({
          onMouseLeave,
          onMouseEnter
        }) =>
          React.createElement(Alert, {
            width: 22,
            height: 22,

            className: 'gm-settings-label-icon',

            onMouseLeave,
            onMouseEnter
          })
        ),

        React.createElement('span', {
          className: 'gm-settings-label-text'
        }, props.text)
      ];

      props.subtext = `**Debug:** ` + props.subtext;
    }

    super(props);
  }

  render() {
    return React.createElement(SwitchItem, {
      value: this.props.isToggled(),
      note: React.createElement(Markdown, {
        className: 'gm-settings-note-markdown'
      }, this.props.subtext || ''),

      disabled: this.props.disabled ? this.props.disabled() : false,

      onChange: this.props.onChange
    }, this.props.text);
  }
}
};