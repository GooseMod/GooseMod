const { React } = goosemod.webpackModules.common;

const SwitchItem = goosemod.webpackModules.findByDisplayName('SwitchItem');

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
        React.createElement(Science),

        React.createElement('span', {
          style: {
            verticalAlign: 'top',
            marginLeft: '6px'
          }
        }, props.text)
      ];
    }

    super(props);
  }

  render() {
    return React.createElement(SwitchItem, {
      value: this.props.isToggled(),
      note: this.props.subtext,

      onChange: this.props.onChange
    }, this.props.text);
  }
}