import * as React from 'react';

import {
  ICountry,
  ICountryCca2,
  ICountryItemProps,
  ICountrySelectProps,
  ICountrySelectStyle,
  ICountrySelectLanguages,
  ISectionTitle,
} from './interface';

declare function getAllCountries(): ICountry[];

declare function getCountryByCca2(cca2: ICountryCca2): ICountry | undefined;

declare function getCountryByCca3(cca3: string): ICountry | undefined;

declare function getCountriesByCallingCode(callingCode: string): ICountry[];

declare function getCountriesByName(
  name: string,
  language?: ICountrySelectLanguages
): Promise<ICountry[]>;

declare function getCountriesByRegion(region: string): ICountry[];

declare function getCountriesBySubregion(subregion: string): ICountry[];

declare function getCountriesDependents(): ICountry[];

declare function getCountriesIndependents(): ICountry[];

declare function loadLanguage(
  language: ICountrySelectLanguages
): Promise<void>;

declare const CountrySelect: React.FC<ICountrySelectProps>;

export default CountrySelect;

export {
  ICountry,
  ICountryCca2,
  ICountryItemProps,
  ICountrySelectProps,
  ICountrySelectStyle,
  ICountrySelectLanguages,
  ISectionTitle,
  getAllCountries,
  getCountryByCca2,
  getCountryByCca3,
  getCountriesByCallingCode,
  getCountriesByName,
  getCountriesByRegion,
  getCountriesBySubregion,
  getCountriesDependents,
  getCountriesIndependents,
  loadLanguage,
};
