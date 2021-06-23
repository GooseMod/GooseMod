const { React } = goosemod.webpackModules.common;

const SearchBar = goosemod.webpackModules.findByDisplayName('SearchBar');

export default class Search extends React.PureComponent {
  render() {
    return React.createElement(SearchBar, {
      ...SearchBar.defaultProps,
      className: this.props.storeSpecific ? 'gm-store-search' : '',

      size: SearchBar.Sizes.MEDIUM,

      query: this.props.text || '',
      placeholder: this.props.placeholder || 'Search',

      onClear: () => {
        this.props.text = '';

        this.forceUpdate();

        this.props.onchange(this.props.text);
      },

      onChange: (x) => {
        this.props.text = x;

        this.forceUpdate();

        this.props.onchange(this.props.text);
      }
    })
  }
}