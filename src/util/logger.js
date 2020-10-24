export const debug = (region, ...args) => {
  console.log(`%cGooseMod%c %c${region}`, 'border: 1px solid white; padding: 2px; background-color: black; color: white', 'background-color: none', `border: 1px solid white; padding: 2px; background-color: rgb(100, 0, 0); color: white`, ...(args));
};