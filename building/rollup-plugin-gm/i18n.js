import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

import langs from '../i18n/langs.json';


import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const distDir = resolve(join(__dirname, '..', '..', 'dist'));
const translationsDir = resolve(join(__dirname, '..', 'i18n', 'translations'));

const getTranslation = (lang) => {
  const path = join(translationsDir, lang + '.json');
  if (!existsSync(path)) return false;

  return JSON.parse(readFileSync(path, 'utf8'));
};

const flattenObj = (obj, key = '') => Object.keys(obj).reduce((acc, x) => {
  const k = (key ? key + '.' : '') + x;

  if (typeof obj[x] === 'object') {
    const f = flattenObj(obj[x], k);

    for (const y of Object.keys(f)) {
      acc[y] = f[y];
    }
  } else {
    acc[k] = obj[x];
  }

  return acc;
}, {});

export default (code) => {
  const defaultTranslation = getTranslation('en-US');

  if (!existsSync(distDir)) mkdirSync(distDir);

  for (const lang of Object.keys(langs)) {
    const outPath = join(distDir, 'goosemod.' + lang + '.js');

    const translation = {
      ...defaultTranslation,
      ...(getTranslation(lang) || {})
    };

    let langCode = code;

    const flatTranslation = flattenObj(translation);

    for (const key in flatTranslation) {
      const val = flatTranslation[key].replaceAll('\n', '\\n').replaceAll('\'', '\\\'').replaceAll('"', '\\"');
      langCode = langCode.replaceAll(`#${key}#`, val);
    }

    writeFileSync(outPath, langCode);
  }
};