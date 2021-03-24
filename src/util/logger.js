export const debug = (_region, ...args) => {
  const regions = _region.split('.');

  const regionStrings = regions.map(x => `%c${x}%c`);
  const regionStyling = regions.reduce((res) => 
    res.concat('color: white; border: 2px solid white; background-color: rgb(0, 150, 0); border-radius: 4px; padding: 3px; margin-left: 2px;', '')
  , []);

  console.log(`%c   ${regionStrings.join(' ')}`,
    'font-size: 15px; background: url(https://goosemod.com/img/logo.jpg) no-repeat; background-size: contain; padding: 2px;',

    ...regionStyling,
    
    ...args
  );
  // console.log(`%cGooseMod%c %c${region}`, 'border: 1px solid white; padding: 2px; background-color: black; color: white', 'background-color: none', `border: 1px solid white; padding: 2px; background-color: rgb(100, 0, 0); color: white`, ...(args));
};