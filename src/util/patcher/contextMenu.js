import { inject, uninject } from './base';
import { getOwnerInstance, findInReactTree } from '../react';

let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};

export const labelToId = (label) => label.toLowerCase().replace(/ /g, '-');

export const getInjectId = (id) => `gm-cm-${id}`;

export const patchTypeToNavId = (type) => {
  switch (type) {
    case 'user':
      return 'user-context';
    
    case 'message':
      return 'message';

    default:
      return type;
  }
};

export const getExtraInfo = (type) => {
  try {
    switch (type) {
      case 'message':
        return getOwnerInstance(document.getElementById('message'))._reactInternalFiber.child.memoizedProps.children.props.children.props;
    
      case 'user':
        return getOwnerInstance(document.querySelector('#user-context'))._reactInternalFiber.return.memoizedProps;

      default:
        return undefined;
    }
  } catch (e) { return undefined; }
};

export const add = (type, itemProps) => {
  const { React } = goosemodScope.webpackModules.common;
  const Menu = goosemodScope.webpackModules.findByProps('MenuItem');

  const wantedNavId = patchTypeToNavId(type);
  const id = itemProps.id || labelToId(itemProps.label);

  if (!itemProps.id) {
    itemProps.id = id;
  }

  const origAction = itemProps.action;

  itemProps.action = function() {
    return origAction(arguments, getExtraInfo(type));
  };

  inject(getInjectId(id), Menu, 'default', (args) => {
    const [ { navId, children } ] = args;
    if (navId !== wantedNavId) {
      return args;
    }

    console.log('inj');
    
    const alreadyHasItem = findInReactTree(children, child => child && child.props && child.props.id === itemProps.id);
    if (alreadyHasItem) return args;

    const item = React.createElement(Menu.MenuItem, itemProps);

    console.log(item);

    let goosemodGroup = findInReactTree(children, child => child && child.props && child.props.goosemod === true);

    console.log(goosemodGroup);

    if (!goosemodGroup) {
      goosemodGroup = React.createElement(Menu.MenuGroup, { goosemod: true }, item);

      console.log('a', goosemodGroup);

      children.push([ React.createElement(Menu.MenuSeparator), goosemodGroup ]);
    } else {
      console.log('b', goosemodGroup);

      if (!Array.isArray(goosemodGroup.props.children)) {
        goosemodGroup.props.children = [ goosemodGroup.props.children ];
      }
    
      goosemodGroup.props.children.push(item);
    }
    
    return args;
  }, true);
};

export const remove = (label) => uninject(getInjectId(labelToId(label)));