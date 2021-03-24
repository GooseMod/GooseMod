let goosemodScope = {};

export const setThisScope = (scope) => {
  goosemodScope = scope;
};


const getModule = () => goosemod.webpackModules.findByProps('BUILT_IN_COMMANDS', 'BUILT_IN_SECTIONS');

const applicationId = '760559484342501406'; // User ID


export const add = (name, description, execute, options = []) => {
  const mod = getModule();

  if (!mod.BUILT_IN_SECTIONS.find((x) => x.name === 'GooseMod')) { // If no GooseMod section
    mod.BUILT_IN_SECTIONS.push({
      id: applicationId,
      icon: '5125aff2f446ad7c45cf2dfd6abf92ed', // Avatar file name for User ID

      name: 'GooseMod',
      type: 2
    });
  }

  mod.BUILT_IN_COMMANDS.push({
    applicationId,
  
    description,
    name,
    execute,
    options,

    id: '-99' // This may need to be unique, but unknown
  });
};

export const remove = (name) => {
  const mod = getModule();

  mod.BUILT_IN_COMMANDS = mod.BUILT_IN_COMMANDS.filter(x => x.name !== name); // Filter out commands with given name

  const gmCommands = mod.BUILT_IN_COMMANDS.filter(x => x.applicationId === applicationId); // Find GooseMod commands via applicationId

  if (gmCommands.length === 0) { // If there is currently no GooseMod commands, remove the section
    mod.BUILT_IN_SECTIONS = mod.BUILT_IN_SECTIONS.filter(x => x.name !== 'GooseMod'); // Filter out GooseMod section
  }
};