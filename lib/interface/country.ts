import { ICountryCca2 } from './countryCca2';

// Currency interface
export interface ICountryCurrency {
  name: string;
  symbol: string;
}

// Currencies object interface
export interface ICountryCurrencies {
  [key: string]: ICountryCurrency | undefined;
}

// Demonym interface
export interface ICountryDemonym {
  f: string;
  m: string;
}

// Demonyms object interface
export interface ICountryDemonyms {
  [key: string]: ICountryDemonym;
}

export interface ICountryNameTranslation {
  official: string;
  common: string;
}

export interface ICountryNativeName {
  [key: string]: ICountryNameTranslation | undefined;
}

export interface ICountryName {
  common: string;
  official: string;
  native: ICountryNativeName;
}

// Country name translation interface
export interface ICountryTranslations {
  ara?: ICountryNameTranslation; // Arabic
  bel?: ICountryNameTranslation; // Belarusian
  bre?: ICountryNameTranslation; // Breton
  bul?: ICountryNameTranslation; // Bulgarian
  ces?: ICountryNameTranslation; // Czech
  deu?: ICountryNameTranslation; // German
  ell?: ICountryNameTranslation; // Greek
  eng?: ICountryNameTranslation; // English
  est?: ICountryNameTranslation; // Estonian
  fin?: ICountryNameTranslation; // Finnish
  fra?: ICountryNameTranslation; // French
  heb?: ICountryNameTranslation; // Hebrew
  hrv?: ICountryNameTranslation; // Croatian
  hun?: ICountryNameTranslation; // Hungarian
  ita?: ICountryNameTranslation; // Italian
  jpn?: ICountryNameTranslation; // Japanese
  kor?: ICountryNameTranslation; // Korean
  nld?: ICountryNameTranslation; // Dutch
  per?: ICountryNameTranslation; // Persian
  pol?: ICountryNameTranslation; // Polish
  por?: ICountryNameTranslation; // Portuguese
  ron?: ICountryNameTranslation; // Romanian
  rus?: ICountryNameTranslation; // Russian
  slk?: ICountryNameTranslation; // Slovak
  spa?: ICountryNameTranslation; // Spanish
  srp?: ICountryNameTranslation; // Serbian
  swe?: ICountryNameTranslation; // Swedish
  tur?: ICountryNameTranslation; // Turkish
  ukr?: ICountryNameTranslation; // Ukrainian
  urd?: ICountryNameTranslation; // Urdu
  zho?: ICountryNameTranslation; // Chinese
  'zho-Hans'?: ICountryNameTranslation; // Simplified Chinese
  'zho-Hant'?: ICountryNameTranslation; // Traditional Chinese
}

// Languages object interface
export interface ICountryLanguages {
  [key: string]: string;
}

// Complete Country interface matching countries.json structure
export interface ICountry {
  name: ICountryName;
  tld: string[];
  cca2: ICountryCca2;
  ccn3: string;
  cca3: string;
  cioc: string;
  independent: boolean;
  status: string;
  unMember: boolean;
  unRegionalGroup: string;
  currencies: ICountryCurrencies;
  idd: {
    root: string;
    suffixes: string[];
  };
  capital: string[];
  altSpellings: string[];
  region: string;
  subregion: string;
  languages: ICountryLanguages;
  translations: ICountryTranslations;
  latlng: [number, number];
  landlocked: boolean;
  borders: string[];
  area: number;
  flag: string;
  customFlag?: React.ReactElement | null | undefined;
  demonyms: ICountryDemonyms;
}
