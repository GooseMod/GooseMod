import * as Cache from './cache';
export const cache = Cache;

let goosemodScope = {};

let getDiscordLang;

export let goosemodStrings; // goosemod.i18n.strings
export let discordStrings;

export const setThisScope = (scope) => {
  Cache.setThisScope(scope);

  goosemodScope = scope;

  const { getLocaleInfo } = goosemodScope.webpackModules.findByProps('chosenLocale', 'languages');
  getDiscordLang = getLocaleInfo;

  goosemodScope.i18nCheckNewLangInterval = setInterval(checkForNewLang, 1000);

  checkForNewLang();
};

let lastLangCode;

const checkForNewLang = async () => {
  const { code } = getDiscordLang();

  if (code === lastLangCode) return; // Lang not changed
  lastLangCode = code;

  goosemodScope.showToast(`New lang detected`);

  goosemodStrings = await Cache.geti18nData();

  const { _proxyContext: { messages } } = goosemodScope.webpackModules.findByProps('chosenLocale', 'languages');

  discordStrings = messages;
};

export const geti18nData = async (lang = getDiscordLang()) => {
  if (lang.code) lang = lang.code; // If wrapped in an object

  let json; // Undefined by default

  try {
    json = await (await fetch(`https://raw.githubusercontent.com/GooseMod/i18n/main/langs/${lang}.json`)).json();
  } catch (e) { // Likely no translation for language so fallback to en-US
    lang = `en-US`;

    console.log(`Failed to get GooseMod i18n data, falling back to ${lang}`, e);

    json = await (await fetch(`https://raw.githubusercontent.com/GooseMod/i18n/main/langs/${lang}.json`)).json();
  }

  return json;
};