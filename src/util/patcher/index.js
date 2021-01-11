export { patch, inject, uninject } from './base';

import * as _contextMenu from './contextMenu';
import * as _miniPopover from './miniPopover';

export const contextMenu = _contextMenu;
export const miniPopover = _miniPopover;

export const setThisScope = (scope) => {
  _contextMenu.setThisScope(scope);
  _miniPopover.setThisScope(scope);
};