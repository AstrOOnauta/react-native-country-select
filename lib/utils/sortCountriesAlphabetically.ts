import { normalizeCountryName } from './normalizeCountryName';
import { getCountryName } from './getCountryName';
import { ICountry, ICountrySelectLanguages } from '../interface';

// Keep the key out of the comparator: computing it inline ran an NFD normalization on
// both sides of every comparison, ~4000 per search instead of 250.
export const sortCountriesAlphabetically = (
  countriesList: ICountry[],
  language: ICountrySelectLanguages
): ICountry[] => {
  return countriesList
    .map((country) => ({
      country,
      sortKey: normalizeCountryName(
        getCountryName(country, language).toLowerCase()
      ),
    }))
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ country }) => country);
};
