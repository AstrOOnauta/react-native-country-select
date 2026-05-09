import { t } from './getTranslation';
import { baseCountries } from '../constants/registry';
import { normalizeCountryName } from './normalizeCountryName';
import { getCountryName } from './getCountryName';
import { ICountry, ICountrySelectLanguages, IListItem } from '../interface';
import { sortCountriesAlphabetically } from './sortCountriesAlphabetically';

type Params = {
  searchQuery: string;
  popularCountries: string[];
  language: ICountrySelectLanguages;
  visibleCountries: string[];
  hiddenCountries: string[];
};

export function getCountriesList({
  searchQuery,
  popularCountries,
  language,
  visibleCountries,
  hiddenCountries,
}: Params): IListItem[] {
  const query = searchQuery.toLowerCase().trim();

  let countriesData = baseCountries as unknown as ICountry[];

  if (visibleCountries.length > 0 && hiddenCountries.length > 0) {
    countriesData = countriesData.filter(
      (country) =>
        visibleCountries.includes(country.cca2) &&
        !hiddenCountries.includes(country.cca2)
    );
  } else if (visibleCountries.length > 0) {
    countriesData = countriesData.filter((country) =>
      visibleCountries.includes(country.cca2)
    );
  } else if (hiddenCountries.length > 0) {
    countriesData = countriesData.filter(
      (country) => !hiddenCountries.includes(country.cca2)
    );
  }

  if (query.length > 0) {
    const normalizedQuery = normalizeCountryName(query);
    const filteredCountries = countriesData.filter((country) => {
      const countryName = getCountryName(country, language);
      const normalizedCountryName = normalizeCountryName(
        countryName.toLowerCase()
      );
      const callingCode = country.idd.root.toLowerCase();
      const flag = country.flag.toLowerCase();
      const countryCode = country.cca2.toLowerCase();

      return (
        normalizedCountryName.includes(normalizedQuery) ||
        countryName.toLowerCase().includes(query) ||
        callingCode.includes(query) ||
        flag.includes(query) ||
        countryCode.includes(query)
      );
    });

    return sortCountriesAlphabetically(filteredCountries, language);
  }

  const popularCountriesData = sortCountriesAlphabetically(
    countriesData.filter((country) => popularCountries.includes(country.cca2)),
    language
  );

  const otherCountriesData = sortCountriesAlphabetically(
    countriesData.filter((country) => !popularCountries.includes(country.cca2)),
    language
  );

  const result: IListItem[] = [];

  if (popularCountriesData.length > 0) {
    result.push({
      isSection: true as const,
      title: t('popularCountriesTitle', language),
    });

    result.push(...popularCountriesData);
    result.push({
      isSection: true as const,
      title: t('allCountriesTitle', language),
    });
  }

  result.push(...otherCountriesData);
  return result;
}
