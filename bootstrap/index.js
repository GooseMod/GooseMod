import sleep from '../src/util/sleep';

const init = async () => {
  while (!window.webpackJsonp?.push) {
    await sleep(10);
  }
  
  let wpRequire;

  if (window.webpackJsonp) { // Older
    wpRequire = window.webpackJsonp.push([[], { get_require: (mod, _exports, wpRequire) => mod.exports = wpRequire }, [["get_require"]]]); // Get Webpack's require via injecting into webpackJsonp
    
    // Remove module injected
    delete wpRequire.m.get_require;
    delete wpRequire.c.get_require;
  } else if (window.webpackChunkdiscord_app) { // New (Canary @ 22nd Oct)
    window.webpackChunkdiscord_app.push([['gm_webpackInject'], {}, (req) => { wpRequire = req; }]);
  }

  const locale = Object.keys(wpRequire.c).map((x) => wpRequire.c[x].exports).find((x) => x?.default?.getLocaleInfo).default.getLocale();
  
  console.log('[GooseMod Bootstrap]', 'Found locale', locale);
  
  // eval(await (await fetch(`http://localhost:1234/goosemod.${locale}.js`)).text());
  eval(await (await fetch(`https://raw.githubusercontent.com/GooseMod/GooseMod/dist-dev/goosemod.${locale}.js?_<buildtime>`, { cache: 'force-cache' })).text());
};

init();
//# sourceURL=GooseMod%20Bootstrap