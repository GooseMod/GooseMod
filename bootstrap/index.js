import sleep from '../src/util/sleep';

const init = async () => {
  while (!window.webpackJsonp?.push) {
    await sleep(10);
  }

  const wpRequire = window.webpackJsonp.push([[], { get_require: (mod, _exports, wpRequire) => mod.exports = wpRequire }, [["get_require"]]]);
  const locale = Object.keys(wpRequire.c).map((x) => wpRequire.c[x].exports).find((x) => x?.default?.getLocaleInfo).default.getLocale();

  console.log('[GooseMod Bootstrap]', 'Found locale', locale);

  // eval(await (await fetch(`http://localhost:1234/goosemod.${locale}.js`)).text());
  eval(await (await fetch(`https://raw.githubusercontent.com/GooseMod/GooseMod/dist-dev/goosemod.${locale}.js?_<buildtime>`, { cache: 'force-cache' })).text());
};

init();
//# sourceURL=GooseMod%20Bootstrap