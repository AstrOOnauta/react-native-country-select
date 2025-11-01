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

declare function getCountryByCca2(cca2: string): ICountry | undefined;

declare function getCountryByCca3(cca3: string): ICountry | undefined;

declare function getCountriesByCallingCode(
  callingCode: string
): ICountry[] | undefined;

declare function getCountriesByName(
  name: string,
  language: ICountrySelectLanguages
): ICountry[] | undefined;

declare function getCountriesByRegion(
  region: string
): ICountry[] | undefined;

declare function getCountriesBySubregion(
  subregion: string
): ICountry[] | undefined;

declare function getContriesDependents(
  cca2: string
): ICountry[] | undefined;

declare function getCountriesIndependents(): ICountry[] | undefined;

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
  getContriesDependents,
  getCountriesIndependents,
};
