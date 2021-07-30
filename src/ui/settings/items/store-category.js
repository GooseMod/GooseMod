import _StoreHeader from './store-header';
import _Card from './card';

export default () => {
const { React } = goosemod.webpackModules.common;

const StoreHeader = _StoreHeader();
const Card = _Card();

const ScrollerClasses = goosemod.webpackModules.findByProps('auto', 'scrollerBase');

return class StoreCategory extends React.PureComponent {
  render() {
    if (!this.props.cards) {
      this.props.cards = goosemod.settings.items.find((x) => x[1] === this.props.itemName)[2].filter((x) => x.type === 'card').sort(this.props.sort).slice(0, 10).map((x) => React.createElement(Card, x));
    }

    return React.createElement('div', {
      className: 'gm-store-category'
    },
      React.createElement(StoreHeader, {
        text: this.props.text
      }),

      React.createElement('div', {
        className: ScrollerClasses.auto
      },
        ...this.props.cards
      ),
    );
  }
}
};