import { patch } from './base';
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

export const patch = (type, itemProps) => {
  const { React } = goosemodScope.webpackModules.common;
  const Menu = goosemodScope.webpackModules.findByProps('MenuItem');

  const wantedNavId = patchTypeToNavId(type);
  const id = itemProps.id || labelToId(itemProps.label);

  if (!itemProps.id) {
    itemProps.id = id;
  }

  const isCheckbox = itemProps.checked !== undefined;

  const origAction = itemProps.action;

  return patch(Menu, 'default', (args) => {
    const [ { navId, children } ] = args;
    if (navId !== wantedNavId) {
      return args;
    }

    const extraInfo = getExtraInfo(type);

    itemProps.action = function() {
      if (isCheckbox) {
        itemProps.checked = !itemProps.checked;
        item.props.checked = itemProps.checked; // Update the actual current item's props too

        getOwnerInstance(document.getElementById(`${wantedNavId}-${itemProps.id}`)).props.onMouseEnter(); // And make it re-render

        return origAction(arguments, extraInfo, itemProps.checked);
      }

      return origAction(arguments, extraInfo);
    };

    const alreadyHasItem = findInReactTree(children, child => child && child.props && child.props.id === itemProps.id);
    if (alreadyHasItem) return args;

    const item = React.createElement(isCheckbox ? Menu.MenuCheckboxItem : Menu.MenuItem, itemProps);
  
    let goosemodGroup = findInReactTree(children, child => child && child.props && child.props.goosemod === true);

    if (!goosemodGroup) {
      goosemodGroup = React.createElement(Menu.MenuGroup, { goosemod: true }, item);

      children.push([ React.createElement(Menu.MenuSeparator), goosemodGroup ]);
    } else {
      if (!Array.isArray(goosemodGroup.props.children)) {
        goosemodGroup.props.children = [ goosemodGroup.props.children ];
      }
    
      goosemodGroup.props.children.push(item);
    }
    
    return args;
  }, true);
};

const uninjectors = {};

export const add = (type, itemProps) => {
  uninjectors[getInjectId(id)] = patch(type, itemProps);
};

export const remove = (label) => {
  const id = getInjectId(labelToId(label));

  if (!uninjectors[id]) return false;

  uninjectors[id]();

  return true;
};