import { ICountry, ICountryCca2, ICountrySelectLanguages } from '../interface';
import {
  baseCountries,
  getTranslation,
  loadLanguage,
} from '../constants/registry';

const countries: ICountry[] = baseCountries as unknown as ICountry[];

export const getAllCountries = (): ICountry[] => {
  return countries;
};

export const getCountriesByCallingCode = (callingCode: string): ICountry[] => {
  return countries.filter((country) => country.idd.root === callingCode);
};

export const getCountryByCca2 = (cca2: ICountryCca2): ICountry | undefined => {
  return countries.find((country) => country.cca2 === cca2);
};

export const getCountryByCca3 = (cca3: string): ICountry | undefined => {
  return countries.find((country) => country.cca3 === cca3);
};

export const getCountriesByRegion = (region: string): ICountry[] => {
  return countries.filter((country) => country.region === region);
};

export const getCountriesBySubregion = (subregion: string): ICountry[] => {
  return countries.filter((country) => country.subregion === subregion);
};

export const getCountriesIndependents = (): ICountry[] => {
  return countries.filter((country) => country.independent);
};

export const getCountriesDependents = (): ICountry[] => {
  return countries.filter((country) => !country.independent);
};

export const getCountriesByName = async (
  name: string,
  language: ICountrySelectLanguages = 'eng'
): Promise<ICountry[]> => {
  await loadLanguage(language);
  const query = name.toLowerCase();
  return countries.filter((country) => {
    const translation = getTranslation(country.cca2, language);
    if (translation) {
      return (
        translation.common.toLowerCase().includes(query) ||
        translation.official.toLowerCase().includes(query)
      );
    }
    return (
      (country.name?.common?.toLowerCase() ?? '').includes(query) ||
      (country.name?.official?.toLowerCase() ?? '').includes(query)
    );
  });
};

export { loadLanguage };
