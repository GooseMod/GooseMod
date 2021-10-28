export default () => {
const { React } = goosemod.webpackModules.common;

const TooltipClasses = goosemod.webpackModules.findByProps('tooltipBottom', 'tooltipRight');

return class SimpleTooltip extends React.PureComponent {
  constructor(props) {
    super(props);

    this.props.position = this.props.position.toLowerCase();

    this.state = {};
  }

  render() {
    return this.props.children({
      onMouseEnter: async () => {
        if (document.querySelector('.gm-tooltip')) document.querySelector('.gm-tooltip').remove();

        let el = document.createElement('div');
        document.querySelector('.layerContainer-yqaFcK').appendChild(el);

        const ref = document.querySelector(`.gm-tooltipref-${this.state.refId}`).getBoundingClientRect();

        const tooltipText = this.props.text;

        el.outerHTML = `<div class="layer-v9HyYc disabledPointerEvents-1ptgTB gm-tooltip" style="position: absolute; top: -1000px; left: -1000px;"><div class="tooltip-2QfLtc ${TooltipClasses[`tooltip${this.props.position[0].toUpperCase() + this.props.position.substring(1)}`]} tooltipPrimary-1d1ph4 tooltipDisablePointerEvents-3eaBGN" style="opacity: 1; transform: none;"><div class="tooltipPointer-3ZfirK"></div><div class="tooltipContent-bqVLWK">${tooltipText}</div></div></div>`;

        el = document.querySelector('.gm-tooltip');

        const tooltipRect = el.getBoundingClientRect();
        
        switch (this.props.position) {
          case 'top': {
            el.style.left = ((ref.left + ref.width / 2) - tooltipRect.width / 2) + 'px';
            el.style.top = (ref.top - tooltipRect.height - 8) + 'px';

            break;
          }

          case 'left': {
            el.style.left = (ref.left - tooltipRect.width - 8) + 'px';
            el.style.top = (ref.top + ref.height / 2 - tooltipRect.height / 2) + 'px';

            break;
          }
        }
      },

      onMouseLeave: () => {
        document.querySelector('.gm-tooltip').remove();
      },

      text: this.props.text,

      className: `gm-tooltipref-${this.state.refId = Math.random().toString().split('.')[1]}`
    })
  }
}
};