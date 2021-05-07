let goosemodScope = {};
let showHideMod = {};

let originalChangelog = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
  showHideMod = goosemodScope.webpackModules.findByProps('showChangeLog');

  const orig = goosemodScope.webpackModules.findByProps('changeLog').changeLog;

  originalChangelog = Object.assign({}, orig);
};


export const showChangelog = () => {
  showHideMod.showChangeLog();
};

export const hideChangelog = () => {
  showHideMod.hideChangeLog();
};

export const resetChangelog = () => {
  setChangelog(originalChangelog);
};

export const setChangelog = (givenObj) => {
  const mod = goosemodScope.webpackModules.findByProps('changeLog');

  const obj = {
    template: 'standard',
    revision: 1,
    locale: 'en-us',

    ...givenObj
  };

  for (const key of Object.keys(mod.changeLog)) {
    delete mod.changeLog[key];
  }

  for (const key of Object.keys(obj)) {
    mod.changeLog[key] = obj[key];
  }
};