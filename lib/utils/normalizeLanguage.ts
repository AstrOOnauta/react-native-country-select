import {
  ICountrySelectLanguages,
  ICountrySelectLanguagesISO1,
  ICountrySelectLanguagesISO2,
} from '../interface/countrySelectLanguages';

const ISO1_TO_ISO2: Record<
  ICountrySelectLanguagesISO1,
  ICountrySelectLanguagesISO2
> = {
  ar: 'ara',
  be: 'bel',
  br: 'bre',
  bg: 'bul',
  cs: 'ces',
  de: 'deu',
  el: 'ell',
  en: 'eng',
  et: 'est',
  fi: 'fin',
  fr: 'fra',
  he: 'heb',
  hr: 'hrv',
  hu: 'hun',
  it: 'ita',
  ja: 'jpn',
  ko: 'kor',
  nl: 'nld',
  fa: 'per',
  pl: 'pol',
  pt: 'por',
  ro: 'ron',
  ru: 'rus',
  sk: 'slk',
  es: 'spa',
  sr: 'srp',
  sv: 'swe',
  tr: 'tur',
  uk: 'ukr',
  ur: 'urd',
  zh: 'zho',
  'zh-Hans': 'zho-Hans',
  'zh-Hant': 'zho-Hant',
};

export function normalizeLanguage(
  input: ICountrySelectLanguages
): ICountrySelectLanguagesISO2 {
  return (
    ISO1_TO_ISO2[input as ICountrySelectLanguagesISO1] ??
    (input as ICountrySelectLanguagesISO2)
  );
}
