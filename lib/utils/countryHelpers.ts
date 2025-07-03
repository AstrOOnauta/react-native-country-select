import {ICountry, ICountryCca2} from '../interface';
import countriesData from '../constants/countries.json';

const countries: ICountry[] = countriesData as unknown as ICountry[];

export const getAllCountries = (): ICountry[] => {
  return countries;
};

export const getCountriesByCallingCode = (callingCode: string): ICountry[] => {
  return countries.filter(
    (country: ICountry) => country.idd.root === callingCode,
  );
};

export const getCountriesByName = (
  name: string,
  language: keyof ICountry['translations'] = 'eng',
): ICountry[] => {
  return countries.filter((country: ICountry) => {
    const translation = country.translations[language];
    if (translation) {
      return (
        translation.common.toLowerCase().includes(name.toLowerCase()) ||
        translation.official.toLowerCase().includes(name.toLowerCase())
      );
    }
    return (
      country.name.common.toLowerCase().includes(name.toLowerCase()) ||
      country.name.official.toLowerCase().includes(name.toLowerCase())
    );
  });
};

export const getCountryByCca2 = (cca2: ICountryCca2): ICountry | undefined => {
  return countries.find((country: ICountry) => country.cca2 === cca2);
};

export const getCountryByCca3 = (cca3: string): ICountry | undefined => {
  return countries.find((country: ICountry) => country.cca3 === cca3);
};

export const getCountriesByRegion = (region: string): ICountry[] => {
  return countries.filter((country: ICountry) => country.region === region);
};

export const getCountriesBySubregion = (subregion: string): ICountry[] => {
  return countries.filter(
    (country: ICountry) => country.subregion === subregion,
  );
};

export const getCountriesIndependents = (): ICountry[] => {
  return countries.filter((country: ICountry) => country.independent);
};

export const getContriesDependents = (): ICountry[] => {
  return countries.filter((country: ICountry) => !country.independent);
};
