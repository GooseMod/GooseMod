import * as PatcherBase from './base';
import { getOwnerInstance, getNodeInternals, findInReactTree } from '../react';

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

export const getExtraInfo = (navId) => {
  try {
    switch (navId) {
      case 'message':
        return getNodeInternals(getOwnerInstance(document.getElementById('message'))).return.return.memoizedProps;
    
      case 'message-actions':
        return getNodeInternals(getOwnerInstance(document.getElementById('message-actions'))).return.return.memoizedProps;

      case 'user-context':
        return getNodeInternals(getOwnerInstance(document.getElementById('user-context'))).return.return.return.return.return.return.memoizedProps;

      default:
        return undefined;
    }
  } catch (e) { return undefined; }
};

const generateElement = (itemProps, _subItems, wantedNavId, type, extraInfo, { Menu, React }) => {
  const isCheckbox = itemProps.checked !== undefined;

  itemProps.id = itemProps.id || labelToId(itemProps.label);

  let subItems = _subItems;
  if (typeof subItems === 'function') subItems = subItems();

  if (subItems) subItems = subItems.map((x) => {
    if (!x.originalAction) x.originalAction = x.action;

    return x;
  });

  itemProps.action = function() {
    if (isCheckbox) {
      itemProps.checked = !itemProps.checked;
      item.props.checked = itemProps.checked; // Update the actual current item's props too

      getOwnerInstance(document.getElementById(`${wantedNavId}-${itemProps.id}`)).props.onMouseEnter(); // And make it re-render

      return itemProps.originalAction(arguments, extraInfo, itemProps.checked);
    }

    return itemProps.originalAction(arguments, extraInfo);
  };

  const component = isCheckbox ? Menu.MenuCheckboxItem : Menu.MenuItem;
  const item = subItems !== undefined ? React.createElement(component, itemProps, ...subItems.map((x) => generateElement(x, x.sub, wantedNavId, type, extraInfo, { Menu, React }))) : React.createElement(component, itemProps);

  return item;
};

export const patch = (type, itemProps) => {
  const { React } = goosemodScope.webpackModules.common;
  const Menu = goosemodScope.webpackModules.findByProps('MenuItem');

  const wantedNavId = patchTypeToNavId(type);

  itemProps.originalAction = itemProps.action;

  return PatcherBase.patch(Menu, 'default', (args) => {
    const [ { navId, children } ] = args;

    if (navId !== wantedNavId &&
      !(wantedNavId === 'message' && navId === 'message-actions') // Special case: expanded MiniPopover menu
    ) {
      return args;
    }

    const alreadyHasItem = findInReactTree(children, child => child && child.props && child.props.id === (itemProps.id || labelToId(itemProps.label)));
    if (alreadyHasItem) return args;

    const clonedProps = Object.assign({}, itemProps);

    const item = generateElement(clonedProps, clonedProps.sub, wantedNavId, type, Object.assign({}, getExtraInfo(navId)), { Menu, React });
  
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


// DEPRECATED: Compatibility functions for modules from older (<5.8.0) GooseMod versions
const uninjectors = {};

export const add = (type, itemProps) => {
  uninjectors[getInjectId(itemProps.id || labelToId(itemProps.label))] = patch(type, itemProps);
};

export const remove = (label) => {
  const id = getInjectId(labelToId(label));

  if (!uninjectors[id]) return false;

  uninjectors[id]();

  return true;
};