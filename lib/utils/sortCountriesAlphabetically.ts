import { normalizeCountryName } from './normalizeCountryName';
import { getCountryName } from './getCountryName';
import { ICountry, ICountrySelectLanguages } from '../interface';

// The sort key is built once per country instead of inside the comparator, which ran
// getCountryName + an NFD normalization on both sides of every comparison — roughly
// 4000 normalizations per search over 250 countries, twice per list build.
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
