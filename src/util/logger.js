export const debug = (region, ...args) => {
  let parentRegion = region.split('.')[0];

  console.log(`%cGooseMod%c %c${region}`, 'border: 1px solid white; padding: 2px; background-color: black; color: white', 'background-color: none', `border: 1px solid white; padding: 2px; background-color: ${(globalThis.modules[parentRegion] && globalThis.modules[parentRegion].logRegionColor) || 'rgb(100, 0, 0)'}; color: white`, ...(args));
};