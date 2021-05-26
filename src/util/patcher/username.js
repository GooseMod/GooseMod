import * as PatcherBase from './base';

let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const patch = (generateElement) => {
  const MessageHeader = goosemodScope.webpackModules.find((x) => x.default && !x.default.displayName && x.default.toString().indexOf('headerText') > -1);

  return PatcherBase.patch(MessageHeader, 'default', (_args, res) => {
    const header = goosemod.reactUtils.findInReactTree(res, el => Array.isArray(el?.props?.children) && el.props.children.find(c => c?.props?.message));

    header.props.children.push(generateElement(header.props.children[0].props));

    return res;
  });
};
