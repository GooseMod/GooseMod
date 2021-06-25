const { React } = goosemod.webpackModules.common;

const FormTitle = goosemod.webpackModules.findByDisplayName('FormTitle');

const Margins = goosemod.webpackModules.findByProps('marginTop20', 'marginBottom20');

const Tooltip = goosemod.webpackModules.findByDisplayName('Tooltip');
const Science = goosemod.webpackModules.findByDisplayName('Science');


export default class Header extends React.PureComponent {
  constructor(props) {
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
            width: 18,
            height: 18,

            className: 'gm-experimental-label-icon',

            onMouseLeave,
            onMouseEnter
          })
        ),

        React.createElement('span', {
          style: {
            verticalAlign: 'unset'
          },

          className: 'gm-experimental-label-text'
        }, props.text)
      ];
    }

    super(props);
  }

  render() {
    return React.createElement(FormTitle, {
      tag: 'h5',

      className: (this.props.i !== 0 ? Margins.marginTop20 + ' ' : '') + Margins.marginBottom8
    }, this.props.text);
  }
}