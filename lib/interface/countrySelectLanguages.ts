export type ICountrySelectLanguagesISO2 =
  | 'ara' // Arabic
  | 'bel' // Belarusian
  | 'bre' // Breton
  | 'bul' // Bulgarian
  | 'ces' // Czech
  | 'deu' // German
  | 'ell' // Greek
  | 'eng' // English
  | 'est' // Estonian
  | 'fin' // Finnish
  | 'fra' // French
  | 'heb' // Hebrew
  | 'hrv' // Croatian
  | 'hun' // Hungarian
  | 'ita' // Italian
  | 'jpn' // Japanese
  | 'kor' // Korean
  | 'nld' // Dutch
  | 'per' // Persian
  | 'pol' // Polish
  | 'por' // Portuguese
  | 'ron' // Romanian
  | 'rus' // Russian
  | 'slk' // Slovak
  | 'spa' // Spanish
  | 'srp' // Serbian
  | 'swe' // Swedish
  | 'tur' // Turkish
  | 'ukr' // Ukrainian
  | 'urd' // Urdu
  | 'zho' // Chinese
  | 'zho-Hans' // Simplified Chinese
  | 'zho-Hant'; // Traditional Chinese

export type ICountrySelectLanguagesISO1 =
  | 'ar' // Arabic
  | 'be' // Belarusian
  | 'br' // Breton
  | 'bg' // Bulgarian
  | 'cs' // Czech
  | 'de' // German
  | 'el' // Greek
  | 'en' // English
  | 'et' // Estonian
  | 'fi' // Finnish
  | 'fr' // French
  | 'he' // Hebrew
  | 'hr' // Croatian
  | 'hu' // Hungarian
  | 'it' // Italian
  | 'ja' // Japanese
  | 'ko' // Korean
  | 'nl' // Dutch
  | 'fa' // Persian
  | 'pl' // Polish
  | 'pt' // Portuguese
  | 'ro' // Romanian
  | 'ru' // Russian
  | 'sk' // Slovak
  | 'es' // Spanish
  | 'sr' // Serbian
  | 'sv' // Swedish
  | 'tr' // Turkish
  | 'uk' // Ukrainian
  | 'ur' // Urdu
  | 'zh' // Chinese
  | 'zh-Hans' // Simplified Chinese
  | 'zh-Hant'; // Traditional Chinese

export type ICountrySelectLanguages =
  | ICountrySelectLanguagesISO2
  | ICountrySelectLanguagesISO1;
