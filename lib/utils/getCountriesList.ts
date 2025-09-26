import {translations} from './getTranslation';
import countries from '../constants/countries.json';
import {normalizeCountryName} from './normalizeCountryName';
import {ICountry, ICountrySelectLanguages, IListItem} from '../interface';
import {sortCountriesAlphabetically} from './sortCountriesAlphabetically';

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

  let countriesData = countries as unknown as ICountry[];

  if (visibleCountries.length > 0 && hiddenCountries.length > 0) {
    countriesData = (countries as unknown as ICountry[]).filter(country => {
      return (
        visibleCountries.includes(country.cca2) &&
        !hiddenCountries.includes(country.cca2)
      );
    });
  }

  if (visibleCountries.length > 0 && hiddenCountries.length === 0) {
    countriesData = (countries as unknown as ICountry[]).filter(country =>
      visibleCountries.includes(country.cca2),
    );
  }

  if (hiddenCountries.length > 0 && visibleCountries.length === 0) {
    countriesData = (countries as unknown as ICountry[]).filter(
      country => !hiddenCountries.includes(country.cca2),
    );
  }

  if (query.length > 0) {
    const filteredCountries = countriesData.filter(country => {
      const countryName =
        country.translations[language]?.common || country.name.common || '';
      const normalizedCountryName = normalizeCountryName(
        countryName.toLowerCase(),
      );
      const normalizedQuery = normalizeCountryName(query);
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
    countriesData.filter(country => popularCountries.includes(country.cca2)),
    language,
  );

  const otherCountriesData = sortCountriesAlphabetically(
    countriesData.filter(country => !popularCountries.includes(country.cca2)),
    language,
  );

  const result: IListItem[] = [];

  if (popularCountriesData.length > 0) {
    result.push({
      isSection: true as const,
      title:
        translations.popularCountriesTitle[language as ICountrySelectLanguages],
    });

    result.push(...popularCountriesData);
    result.push({
      isSection: true as const,
      title:
        translations.allCountriesTitle[language as ICountrySelectLanguages],
    });
  }

  result.push(...otherCountriesData);
  return result;
}
