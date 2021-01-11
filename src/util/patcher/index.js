export { patch, inject, uninject } from './base';

import * as _contextMenu from './contextMenu';

export const contextMenu = _contextMenu;

export const setThisScope = (scope) => {
  _contextMenu.setThisScope(scope);
};