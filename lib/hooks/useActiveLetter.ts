import { useCallback, useRef, useState } from 'react';

import { getCountryName } from '../utils/getCountryName';
import { normalizeCountryName } from '../utils/normalizeCountryName';
import {
  ICountry,
  ICountrySelectLanguages,
  IListItem,
} from '../interface';

interface UseActiveLetterParams {
  countriesList: IListItem[];
  allCountriesStartIndex: number;
  language: ICountrySelectLanguages;
}

interface ViewableItem {
  item: IListItem;
  index: number | null;
}

export function useActiveLetter({
  countriesList,
  allCountriesStartIndex,
  language,
}: UseActiveLetterParams) {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const isProgrammaticScrollRef = useRef(false);

  const latestArgsRef = useRef({
    countriesList,
    allCountriesStartIndex,
    language,
  });
  latestArgsRef.current = {
    countriesList,
    allCountriesStartIndex,
    language,
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewableItem[] }) => {
      if (isProgrammaticScrollRef.current) {
        return;
      }
      const { allCountriesStartIndex: startIdx, language: lang } =
        latestArgsRef.current;

      let updated: string | null = null;
      for (const v of viewableItems) {
        const idx = v.index ?? -1;
        if (!('isSection' in v.item) && idx >= startIdx) {
          const name = getCountryName(v.item as ICountry, lang);
          if (name) {
            const normalized = normalizeCountryName(name.toLowerCase());
            const first = normalized[0] || '';
            if (first) updated = first.toUpperCase();
          }
          break;
        }
      }
      setActiveLetter(updated);
    }
  ).current;

  const onMomentumScrollEnd = useCallback(() => {
    isProgrammaticScrollRef.current = false;
  }, []);

  const onScrollEndDrag = useCallback(() => {
    isProgrammaticScrollRef.current = false;
  }, []);

  const resetActiveLetter = useCallback(() => {
    setActiveLetter(null);
  }, []);

  return {
    activeLetter,
    setActiveLetter,
    isProgrammaticScrollRef,
    onViewableItemsChanged,
    onMomentumScrollEnd,
    onScrollEndDrag,
    resetActiveLetter,
  };
}
