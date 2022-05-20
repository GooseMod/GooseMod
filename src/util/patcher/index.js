export { patch, inject, uninject } from './base';
export { default as simpleTooltip } from './simpleTooltip';

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
  for (const fn of [ _contextMenu.setThisScope, _miniPopover.setThisScope, _channelTextAreaButtons.setThisScope, _commands.setThisScope, _internalMessage.setThisScope, _notices.setThisScope, _headerBarButtons.setThisScope, _userBadges.setThisScope, _username.setThisScope, _guildBadges.setThisScope ]) {
    try {
      fn(scope);
    } catch (e) {
      console.error('[GooseMod] Failed to scope patcher module', e, fn);
    }
  }
};