export default () => {
  const mods = {
    powercord: 'powercord',
    vizality: 'vizality',
    ED: 'enhanceddiscord',
    BdApi: 'betterdiscord'
  };

  return `Discord:
Client: ${window.DiscordNative ? 'desktop' : 'web'}
User Agent: ${navigator.userAgent}
Release Channel: ${GLOBAL_ENV.RELEASE_CHANNEL}
Other Mods: ${Object.keys(mods).filter((x) => Object.keys(window).includes(x)).map((x) => mods[x]).join(', ')}

GooseMod:
GM Version: ${goosemodScope.versioning.version} (${goosemodScope.versioning.hash})
GM Branch: ${goosemodScope.storage.get('goosemodUntetheredBranch')}
GM Extension Version: ${window.gmExtension}
GM Storage Impl: ${goosemodScope.storage.type}
Modules: ${Object.keys(goosemodScope.modules).join(', ')}`;
};