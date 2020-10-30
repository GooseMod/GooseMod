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
    date: orig.date,

    template: orig.template,

    experiment_bucket: orig.experiment_bucket,
    experiment_names: orig.experiment_names
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

  mod.changeLog.template = originalChangelog.template;

  mod.experiment_bucket = originalChangelog.experiment_bucket,
  mod.experiment_names = originalChangelog.experiment_names
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

  mod.changeLog.template = 'standard';

  delete mod.changeLog.experiment_bucket;
  delete mod.changeLog.experiment_names;
};