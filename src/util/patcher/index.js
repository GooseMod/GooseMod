export { patch, inject, uninject } from './base';

import * as _contextMenu from './contextMenu';
import * as _miniPopover from './miniPopover';
import * as _channelTextAreaButtons from './channelTextAreaButtons';
import * as _commands from './commands';
import * as _internalMessage from './internalMessage';

export const contextMenu = _contextMenu;
export const miniPopover = _miniPopover;
export const channelTextAreaButtons = _channelTextAreaButtons;
export const commands = _commands;
export const internalMessage = _internalMessage.send;

export const setThisScope = (scope) => {
  _contextMenu.setThisScope(scope);
  _miniPopover.setThisScope(scope);
  _channelTextAreaButtons.setThisScope(scope);
  _commands.setThisScope(scope);
  _internalMessage.setThisScope(scope);
};