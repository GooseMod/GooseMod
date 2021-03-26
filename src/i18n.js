let goosemodScope = {};

let getDiscordLang;

export let goosemodStrings; // goosemod.i18n.strings
export let discordStrings;

export const setThisScope = (scope) => {
  goosemodScope = scope;

  const { getLocaleInfo } = goosemod.webpackModules.findByProps('chosenLocale', 'languages');
  getDiscordLang = getLocaleInfo;

  goosemodScope.i18nCheckNewLangInterval = setInterval(checkForNewLang, 1000);

  checkForNewLang();
};

let lastLangCode;

const checkForNewLang = async () => {
  const { code } = getDiscordLang();

  if (code === lastLangCode) return; // Lang not changed
  lastLangCode = code;

  goosemodStrings = await geti18nData();

  const { _proxyContext: { messages } } = goosemodScope.webpackModules.findByProps('chosenLocale', 'languages');

  discordStrings = messages;
};

const geti18nData = async (lang = getDiscordLang()) => {
  if (lang.code) lang = lang.code; // If wrapped in an object

  let json; // Undefined by default

  try {
    json = await (await fetch(`https://raw.githubusercontent.com/GooseMod/i18n/main/langs/${code}.json`)).json();
  } catch (e) { } // Likely no translation for language so ignore

  return json;
};