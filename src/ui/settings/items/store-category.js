const { React } = goosemod.webpackModules.common;

import StoreHeader from './store-header';
import Card from './card';

const ScrollerClasses = goosemod.webpackModules.findByProps('auto', 'scrollerBase');

export default class StoreCategory extends React.PureComponent {
  render() {
    return React.createElement('div', {
      className: 'gm-store-category'
    },
      React.createElement(StoreHeader, {
        text: this.props.text
      }),

      React.createElement('div', {
        className: ScrollerClasses.auto
      },
        goosemod.settings.items.find((x) => x[1] === this.props.itemName)[2].filter((x) => x.type === 'card').sort(this.props.sort).slice(0, 10).map((x) => React.createElement(Card, x))
      ),
    );
  }
}