import * as PatcherBase from './base';

let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const patch = (generateElement) => {
  const MessageHeader = goosemodScope.webpackModules.find((x) => x.default && !x.default.displayName && x.default.toString().indexOf('headerText') > -1);
  
  // Advanced-ish patching inside of Username but glitched and overcomplicated
  if (goosemod.settings.gmSettings.username_next) {
    return PatcherBase.patch(MessageHeader, 'default', (_args, res) => {
      const header = goosemod.reactUtils.findInReactTree(res, el => Array.isArray(el?.props?.children) && el.props.children.find(c => c?.props?.message));
      const [ Username ] = header.props.children;
      
      PatcherBase.patch(Username, 'type', (_args, res) => {
        const [ , Inner ] = res.props.children;
        
        PatcherBase.patch(Inner.props, 'children', (_args, res) => {
          res.props.children = [
            res.props.children,
            generateElement(Username.props)
          ];
          
          return res;
        });
      });
      
      return res;
    });
  }
  
  return PatcherBase.patch(MessageHeader, 'default', (_args, res) => {
    const header = goosemod.reactUtils.findInReactTree(res, el => Array.isArray(el?.props?.children) && el.props.children.find(c => c?.props?.message));
    
    header.props.children.push(generateElement(header.props.children[0].props));
    
    return res;
  });
};
