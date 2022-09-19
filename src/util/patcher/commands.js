let goosemodScope = {};
let Commands;

export const setThisScope = (scope) => {
  goosemodScope = scope;

  Commands = goosemodScope.webpackModules.findByProps('BUILT_IN_COMMANDS', 'BUILT_IN_SECTIONS');

  const { React } = goosemodScope.webpackModules.common;

  const iconManager = goosemod.webpackModules.findByProps('getIconComponent');
  const ApplicationCommandItem = goosemod.webpackModules.find(x => x.default?.displayName === 'ApplicationCommandItem');
  const searchManager = goosemod.webpackModules.findByProps('useSearchManager');

  const section = { id: applicationId, type: 0, name: 'GooseMod' };

  goosemod.patcher.patch(iconManager, 'getIconComponent', ([ section ]) => { // Custom icon for sidebar/general
    if (section.id === applicationId) return (e) => React.createElement('div', { className: 'wrapper-1wwiGV selectable-fgiA2c', style: { width: e.width, height: e.height, padding: e.padding ?? 0 } }, React.createElement('img', { src: 'https://goosemod.com/img/logo.jpg', style: { width: e.width, height: e.height, borderRadius: '50%' }, className: 'icon-1kx1ir' }));
  });

  goosemod.patcher.patch(ApplicationCommandItem, 'default', ([ { command }], ret) => { // Custom icon in commands/results
    if (command.applicationId === applicationId) ret.props.children[0] = React.createElement('div', { className: 'wrapper-3t15Cn image-1a_IXB', style: { width: 32, height: 32 } }, React.createElement('img', { src: 'https://goosemod.com/img/logo.jpg', style: { width: 32, height: 32, borderRadius: '50%' }, className: 'icon-1kx1ir' }));

    return ret;
  });

  goosemod.patcher.patch(searchManager, 'useSearchManager', (args, ret) => {
    const gmCommands = Object.values(Commands.BUILT_IN_COMMANDS).filter(x => x.applicationId === applicationId);
    if (gmCommands.length === 0) return ret; // No GM commands, don't add

    if (!ret.activeSections.find(x => x.id === section.id)) ret.activeSections.push(section);
    if (!ret.sectionDescriptors.find(x => x.id === section.id)) ret.sectionDescriptors.push(section); // Add to sections sidebar

    let currentSection = ret.commandsByActiveSection.find(x => x.section.id === section.id);
    if (currentSection) currentSection.data = gmCommands;
      else if ((ret.filteredSectionId == null || ret.filteredSectionId === applicationId)) ret.commandsByActiveSection.push({ section, data: gmCommands }); // Add our section to commands

    if (ret.commandsByActiveSection.find(x => x.section.id === '-1')) { // Remove broken (shows stuck loading) commands from normal built-in
      const builtin = ret.commandsByActiveSection.find(x => x.section.id === '-1');
      builtin.data = builtin.data.filter(x => x.applicationId !== applicationId);
    }

    return ret;
  });
};

const applicationId = "-3";

export const add = (name, description, execute, options = []) => {
  const mod = Commands;

  for (const o of options) {
    o.displayName = o.displayName ?? o.name; // ensure displayName or crash
  }

  mod.BUILT_IN_COMMANDS.push({
    applicationId,

    type: 1,
    inputType: 0,

    description,
    name,
    displayName: name,
    displayDescription: description,
    execute,
    options,

    id: `-${Math.random().toString().split('.')[1].substring(0, 5)}` // Randomly generate ID
  });
};

export const remove = (name) => {
  const mod = Commands;

  mod.BUILT_IN_COMMANDS = mod.BUILT_IN_COMMANDS.filter(x => x.name !== name); // Filter out commands with given name
};
