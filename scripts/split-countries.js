/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const SOURCE = path.resolve(__dirname, './countries.source.json');
const OUT_BASE = path.resolve(
  __dirname,
  '../lib/constants/countries.base.json'
);
const OUT_TRANSLATIONS_DIR = path.resolve(
  __dirname,
  '../lib/constants/translations'
);

if (!fs.existsSync(OUT_TRANSLATIONS_DIR)) {
  fs.mkdirSync(OUT_TRANSLATIONS_DIR, { recursive: true });
}

const all = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));

const baseList = [];
const translationsByLang = {};

for (const country of all) {
  const { translations, ...rest } = country;
  baseList.push(rest);

  if (!translations) continue;
  for (const lang of Object.keys(translations)) {
    if (!translationsByLang[lang]) translationsByLang[lang] = {};
    translationsByLang[lang][country.cca2] = translations[lang];
  }
}

fs.writeFileSync(OUT_BASE, JSON.stringify(baseList));
console.log(
  `wrote ${baseList.length} countries to countries.base.json (${
    fs.statSync(OUT_BASE).size
  } bytes)`
);

for (const lang of Object.keys(translationsByLang)) {
  const file = path.join(OUT_TRANSLATIONS_DIR, `${lang}.json`);
  fs.writeFileSync(file, JSON.stringify(translationsByLang[lang]));
  console.log(
    `wrote ${lang}.json (${fs.statSync(file).size} bytes, ${
      Object.keys(translationsByLang[lang]).length
    } countries)`
  );
}

console.log('done.');
