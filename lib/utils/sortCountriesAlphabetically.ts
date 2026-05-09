import { normalizeCountryName } from './normalizeCountryName';
import { getCountryName } from './getCountryName';
import { ICountry, ICountrySelectLanguages } from '../interface';

export const sortCountriesAlphabetically = (
  countriesList: ICountry[],
  language: ICountrySelectLanguages
): ICountry[] => {
  return [...countriesList].sort((a, b) => {
    const nameA = normalizeCountryName(
      getCountryName(a, language).toLowerCase()
    );
    const nameB = normalizeCountryName(
      getCountryName(b, language).toLowerCase()
    );
    return nameA.localeCompare(nameB);
  });
};
