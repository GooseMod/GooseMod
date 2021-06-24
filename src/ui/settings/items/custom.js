const { React } = goosemod.webpackModules.common;

export default class Custom extends React.PureComponent {
  render() {
    return React.createElement('div', {
      ref: (ref) => {
        if (!ref) return;
        ref.appendChild(typeof this.props.element === 'function' ? this.props.element() : this.props.element);
      }
    });
  }
}