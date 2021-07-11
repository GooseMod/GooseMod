export { patch, inject, uninject } from './base';

import * as _contextMenu from './contextMenu';
import * as _miniPopover from './miniPopover';
import * as _channelTextAreaButtons from './channelTextAreaButtons';
import * as _commands from './commands';
import * as _internalMessage from './internalMessage';
import * as _notices from './notices';
import * as _headerBarButtons from './headerBarButtons';
import * as _userBadges from './userBadges';
import * as _username from './username';
import * as _guildBadges from './guildBadges';

export const contextMenu = _contextMenu;
export const miniPopover = _miniPopover;
export const channelTextAreaButtons = _channelTextAreaButtons;
export const commands = _commands;
export const internalMessage = _internalMessage.send;
export const notices = _notices;
export const headerBarButtons = _headerBarButtons;
export const userBadges = _userBadges;
export const username = _username;
export const guildBadges = _guildBadges;

export const setThisScope = (scope) => {
  _contextMenu.setThisScope(scope);
  _miniPopover.setThisScope(scope);
  _channelTextAreaButtons.setThisScope(scope);
  _commands.setThisScope(scope);
  _internalMessage.setThisScope(scope);
  _notices.setThisScope(scope);
  _headerBarButtons.setThisScope(scope);
  _userBadges.setThisScope(scope);
  _username.setThisScope(scope);
  _guildBadges.setThisScope(scope);
};