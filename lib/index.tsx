import { CountrySelect } from './components';
import {
  ICountry,
  ICountryCca2,
  ICountryItemProps,
  ICountrySelectProps,
  ICountrySelectStyle,
  ICountrySelectLanguages,
  ISectionTitle,
} from './interface';
import {
  getAllCountries,
  getCountryByCca2,
  getCountryByCca3,
  getCountriesByCallingCode,
  getCountriesByName,
  getCountriesByRegion,
  getCountriesBySubregion,
  getContriesDependents,
  getCountriesIndependents,
} from './utils/countryHelpers';

export default CountrySelect;

export {
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

export type {
  ICountry,
  ICountryCca2,
  ICountryItemProps,
  ICountrySelectProps,
  ICountrySelectStyle,
  ICountrySelectLanguages,
  ISectionTitle,
};
