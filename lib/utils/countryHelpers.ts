import { ICountry, ICountryCca2, ICountrySelectLanguages } from '../interface';
import countriesData from '../constants/countries.json';
import { normalizeLanguage } from './normalizeLanguage';
import { normalizeCountryName } from './normalizeCountryName';

const countries: ICountry[] = countriesData as unknown as ICountry[];

export const getAllCountries = (): ICountry[] => countries;

export const getCountriesByCallingCode = (callingCode: string): ICountry[] =>
  countries.filter((country) => country.idd.root === callingCode);

export const getCountryByCca2 = (
  cca2: ICountryCca2
): ICountry | undefined =>
  countries.find((country) => country.cca2 === cca2);

export const getCountryByCca3 = (cca3: string): ICountry | undefined =>
  countries.find((country) => country.cca3 === cca3);

export const getCountriesByRegion = (region: string): ICountry[] =>
  countries.filter((country) => country.region === region);

export const getCountriesBySubregion = (subregion: string): ICountry[] =>
  countries.filter((country) => country.subregion === subregion);

export const getCountriesIndependents = (): ICountry[] =>
  countries.filter((country) => country.independent);

export const getCountriesDependents = (): ICountry[] =>
  countries.filter((country) => !country.independent);

// Diacritics are dropped on both sides, like the modal search: "sao tome" finds
// "São Tomé and Príncipe".
export const getCountriesByName = (
  name: string,
  language: ICountrySelectLanguages = 'eng'
): ICountry[] => {
  const query = normalizeCountryName(name.toLowerCase());
  const lang = normalizeLanguage(language);
  const matches = (value?: string) =>
    normalizeCountryName(value?.toLowerCase() ?? '').includes(query);

  return countries.filter((country) => {
    const translation = country.translations?.[lang];
    if (translation) {
      return matches(translation.common) || matches(translation.official);
    }
    return matches(country.name?.common) || matches(country.name?.official);
  });
};
