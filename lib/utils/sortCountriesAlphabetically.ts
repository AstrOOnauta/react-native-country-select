import {normalizeCountryName} from './normalizeCountryName';
import {ICountry, ICountrySelectLanguages} from '../interface';

export const sortCountriesAlphabetically = (
  countriesList: ICountry[],
  language: ICountrySelectLanguages,
): ICountry[] => {
  return [...countriesList].sort((a, b) => {
    const nameA = normalizeCountryName(
      (a.translations[language]?.common || a.name.common || '').toLowerCase(),
    );
    const nameB = normalizeCountryName(
      (b.translations[language]?.common || b.name.common || '').toLowerCase(),
    );
    return nameA.localeCompare(nameB);
  });
};
