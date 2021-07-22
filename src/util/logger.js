// Color utils (from GEx1)
const fromStr = (str) => str.replace('rgb(', '').replace(')', '').split(', ');
const toStr = ([r, g, b]) => `rgb(${r}, ${g}, ${b})`;

const light = (str, val) => toStr(fromStr(str).map((x) => x * val));


const gmColor = '88, 101, 242'; // New blurple
const regionColor = '114, 137, 218'; // Old blurple

const makeRegionStyle = (color) => `background-color: rgb(${color}); color: white; border-radius: 4px; border: 2px solid ${light(color, 0.5)}; padding: 3px 6px 3px 6px; font-weight: bold;`;


export const debug = (_region, ...args) => {
  const regions = _region.split('.');

  const regionStrings = regions.map(x => `%c${x}%c`);
  const regionStyling = regions.reduce((res) => 
    res.concat(makeRegionStyle(regionColor), '')
  , []);

  console.log(`%cGooseMod%c ${regionStrings.join(' ')}`,
    makeRegionStyle(gmColor),
    '',

    ...regionStyling,
    
    ...args
  );
};