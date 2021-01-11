import { patch } from './base';
import { findInReactTree } from '../react';

let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const patch = (tooltipText, svgSrc, clickHandler) => {
  const { React } = goosemodScope.webpackModules.common;
  const Tooltip = goosemodScope.webpackModules.findByDisplayName('Tooltip');
  const { icon: iconClass } = goosemodScope.webpackModules.findByProps('icon', 'isHeader');
  
  const MiniPopover = goosemodScope.webpackModules.find((m) => m.default && m.default.displayName === 'MiniPopover')
  
  return patch(MiniPopover, 'default', (args, res) => {
    const props = findInReactTree(res, (r) => r && r.message);
    if (!props) return res;

    res.props.children.unshift(
      React.createElement(Tooltip, {
        postion: "top",
        text: tooltipText
      }, ({
        onMouseLeave,
        onMouseEnter
      }) =>
        React.createElement(MiniPopover.Button, {
          onClick: () => {
            clickHandler(props);
          },
          onMouseEnter: onMouseEnter,
          onMouseLeave: onMouseLeave
        },
          React.createElement("img", {
            src: svgSrc,
            width: "24px",
            height: "24px",
            className: iconClass
          })
        )
      )
    );

    return res;
  });
};