import * as PatcherBase from './base';

let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const patch = (generateElement, { before = false } = {}) => {
  const UsernameReal = goosemod.webpackModules.find((x) => x.default && typeof x.default === 'function' && x.default.toString().includes('e.hideTag'));
  const { React } = goosemod.webpackModules.common;

  return PatcherBase.patch(UsernameReal, 'default', ([ props ], res) => {
    const el = generateElement(props);
    if (!el || el.props.children === '') return;

    const spacer = React.createElement('span', { // Spacer
      style: {
        width: '5px',
        display: 'inline-block'
      }
    });

    delete el.props.style.marginLeft;
    delete el.props.style.marginRight;


    if (!before) res.props.children.push(spacer, el);
      else res.props.children.unshift(el, spacer);

    return res;
  });
};
