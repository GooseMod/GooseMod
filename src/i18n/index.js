import * as Cache from './cache';
export const cache = Cache;

let goosemodScope = {};

export let forced = false;

export let goosemodStrings; // goosemod.i18n.strings
export let discordStrings;


export const setThisScope = (scope) => {
  Cache.setThisScope(scope);

  goosemodScope = scope;

  goosemodScope.i18nCheckNewLangInterval = setInterval(checkForNewLang, 1000);
};

const getDiscordLang = () => goosemodScope.webpackModules.findByProps('getLocaleInfo').getLocaleInfo();

let lastLangCode;

export const checkForNewLang = async () => {
  if (forced) return; // If forced, ignore Discord lang

  const { code } = getDiscordLang();

  if (code === lastLangCode) return; // Lang not changed

  // goosemodScope.showToast(`New lang detected`);

  await updateExports(code);
};

export const updateExports = async (code) => {
  lastLangCode = code;

  goosemodStrings = await Cache.geti18nData(code);

  const module = goosemodScope.webpackModules.findByProps('getLocaleInfo');

  const context = module._proxyContext || module._provider._context; // _proxyContext is old, not in Canary since 12th July

  discordStrings = {
    ...context.defaultMessages,
    ...context.messages  
  };
};

export const geti18nData = async (lang = (getDiscordLang().code)) => {
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

export const forceLang = async (code) => {
  if (code === 'Unspecified') {
    forced = false;
    await checkForNewLang();

    return;
  }

  forced = true;

  await updateExports(code);
};