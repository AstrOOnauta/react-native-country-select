import { useMemo } from 'react';

import { getCountriesList } from '../utils/getCountriesList';
import {
  ICountryCca2,
  ICountrySelectLanguages,
  IListItem,
} from '../interface';

interface UseCountriesDataParams {
  searchQuery: string;
  popularCountries: string[];
  language: ICountrySelectLanguages;
  visibleCountries: ICountryCca2[];
  hiddenCountries: ICountryCca2[];
}

interface UseCountriesDataResult {
  countriesList: IListItem[];
  allCountriesStartIndex: number;
}

export function useCountriesData({
  searchQuery,
  popularCountries,
  language,
  visibleCountries,
  hiddenCountries,
}: UseCountriesDataParams): UseCountriesDataResult {
  return useMemo(() => {
    const countriesList = getCountriesList({
      searchQuery,
      popularCountries,
      language,
      visibleCountries: visibleCountries as string[],
      hiddenCountries: hiddenCountries as string[],
    });

    let firstSection = -1;
    let secondSection = -1;
    for (let i = 0; i < countriesList.length; i++) {
      if ('isSection' in countriesList[i]) {
        if (firstSection === -1) {
          firstSection = i;
        } else {
          secondSection = i;
          break;
        }
      }
    }

    const allCountriesStartIndex =
      secondSection !== -1 ? secondSection + 1 : 0;

    return { countriesList, allCountriesStartIndex };
  }, [
    searchQuery,
    popularCountries,
    language,
    visibleCountries,
    hiddenCountries,
  ]);
}
