import { ICountryCca2 } from './countryCca2';
import { ICountrySelectLanguagesISO2 } from './countrySelectLanguages';

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

export interface ICountryNameLocalized {
  language: ICountrySelectLanguagesISO2;
  common: string;
  official: string;
}

export interface ICountryName {
  common: string;
  official: string;
  native: ICountryNativeName;
  translation?: ICountryNameLocalized;
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
  latlng: [number, number];
  landlocked: boolean;
  borders: string[];
  area: number;
  flag: string;
  customFlag?: React.ReactElement | null | undefined;
  demonyms: ICountryDemonyms;
}
