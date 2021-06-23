const { React } = goosemod.webpackModules.common;

const SelectTempWrapper = goosemod.webpackModules.findByDisplayName('SelectTempWrapper');

const FormText = goosemod.webpackModules.findByDisplayName('FormText');

const FormTextClasses = goosemod.webpackModules.findByProps('formText', 'placeholder');


export default class DropdownIndividual extends React.PureComponent {
  render() {
    if (typeof this.props.options === 'function') {
      this.props.options = this.props.options();
    }

    if (!this.props.value) {
      this.props.value = (this.props.selected || (() => {}))() || this.props.options[0];
    }

    return React.createElement('div', {
        className: 'gm-inline-dropdown'
      },

      React.createElement(FormText, {
        className: FormTextClasses.description
      }, this.props.label),
    
      React.createElement(SelectTempWrapper, {
        searchable: false,

        onChange: (x) => {
          this.props.value = x.value;

          this.forceUpdate();

          this.props.onchange(this.props.value);
        },

        value: this.props.value,

        options: this.props.options.map((x) => ({ label: x, value: x}))
      })
  )
  }
}