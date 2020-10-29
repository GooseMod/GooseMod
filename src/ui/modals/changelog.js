let goosemodScope = {};
let showHideMod = {};

let originalChangelog = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
  showHideMod = goosemodScope.webpackModules.findByProps('showChangeLog');

  const orig = goosemodScope.webpackModules.findByProps('changeLog').changeLog;

  originalChangelog = {
    body: orig.body,
    image: orig.image,
    date: orig.date
  };
};


export const showChangelog = () => {
  showHideMod.showChangeLog();
};

export const hideChangelog = () => {
  showHideMod.hideChangeLog();
};

export const resetChangelog = () => {
  let mod = goosemodScope.webpackModules.findByProps('changeLog');
  
  mod.changeLog.body = originalChangelog.body;
  mod.changeLog.image = originalChangelog.image;
  mod.changeLog.date = originalChangelog.date;
}

export const setChangelog = ({body, image, date}) => {
  let mod = goosemodScope.webpackModules.findByProps('changeLog');

  if (body) {
    mod.changeLog.body = body;
  }

  if (image) {
    mod.changeLog.image = image;
  }

  if (date) {
    mod.changeLog.date = date;
  }
};