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
        document.querySelectorAll('.layerContainer-2v_Sit')[1].appendChild(el);

        const ref = document.querySelector(`.gm-tooltipref-${this.state.refId}`).getBoundingClientRect();

        el.outerHTML = `<div class="layer-2aCOJ3 disabledPointerEvents-2AmYRc gm-tooltip" style="position: absolute; top: -1000px; left: -1000px;"><div class="${TooltipClasses[`tooltip${this.props.position[0].toUpperCase() + this.props.position.substring(1)}`]} tooltip-14MtrL tooltipPrimary-3qLMbS tooltipDisablePointerEvents-1huO19" style="opacity: 1; transform: none;"><div class="tooltipPointer-3L49xb"></div><div class="tooltipContent-Nejnvh tooltip-1j5_GT text-sm-normal-3Zj3Iv">${this.props.text}</div></div></div>`;

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
        if (document.querySelector('.gm-tooltip')) document.querySelector('.gm-tooltip').remove();
      },

      text: this.props.text,

      className: `gm-tooltipref-${this.state.refId = Math.random().toString().split('.')[1]}`
    })
  }
}
};