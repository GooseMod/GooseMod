import * as _avatar from './avatar';

export const avatar = _avatar;

export const setThisScope = (scope) => {
  _avatar.setThisScope(scope);
};

export const patch = () => {
  _avatar.patch()
};