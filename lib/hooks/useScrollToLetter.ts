import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { FlatList } from 'react-native';

import { getCountryName } from '../utils/getCountryName';
import { normalizeCountryName } from '../utils/normalizeCountryName';
import {
  ICountry,
  ICountrySelectLanguages,
  IListItem,
} from '../interface';

interface UseScrollToLetterParams {
  flatListRef: MutableRefObject<FlatList<IListItem> | null>;
  countriesList: IListItem[];
  language: ICountrySelectLanguages;
  setActiveLetter: (letter: string | null) => void;
  isProgrammaticScrollRef: MutableRefObject<boolean>;
}

const RETRY_DELAY = 50;

export function useScrollToLetter({
  flatListRef,
  countriesList,
  language,
  setActiveLetter,
  isProgrammaticScrollRef,
}: UseScrollToLetterParams) {
  const averageItemLengthRef = useRef(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Read at scroll time rather than closed over: the retry below fires later, and the
  // list may have shrunk since (a search typed while it was pending).
  const listLengthRef = useRef(countriesList.length);
  listLengthRef.current = countriesList.length;

  useEffect(
    () => () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    },
    []
  );

  // VirtualizedList throws on an out-of-range index instead of reporting it through
  // onScrollToIndexFailed, so the bound is checked here.
  const scrollToIndexSafely = useCallback(
    (index: number) => {
      if (index < 0 || index >= listLengthRef.current) {
        return;
      }
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0,
      });
    },
    [flatListRef]
  );

  const handlePressLetter = useCallback(
    (index: number) => {
      isProgrammaticScrollRef.current = true;

      let computedLetter: string | null = null;
      for (let i = index; i < countriesList.length; i++) {
        const item = countriesList[i];
        if (!('isSection' in item)) {
          const name = getCountryName(item as ICountry, language);
          if (name) {
            const normalized = normalizeCountryName(name.toLowerCase());
            const first = normalized[0] || '';
            if (first) computedLetter = first.toUpperCase();
          }
          break;
        }
      }
      if (computedLetter) {
        setActiveLetter(computedLetter);
      }

      scrollToIndexSafely(index);
    },
    [
      countriesList,
      language,
      setActiveLetter,
      isProgrammaticScrollRef,
      scrollToIndexSafely,
    ]
  );

  const onScrollToIndexFailed = useCallback(
    ({
      index,
      averageItemLength,
    }: {
      index: number;
      averageItemLength: number;
    }) => {
      if (averageItemLength > 0) {
        averageItemLengthRef.current = averageItemLength;
      }
      const fallbackLength = averageItemLengthRef.current || 0;
      const estimatedOffset = Math.max(0, fallbackLength * index);

      flatListRef.current?.scrollToOffset({
        offset: estimatedOffset,
        animated: false,
      });

      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      retryTimeoutRef.current = setTimeout(() => {
        retryTimeoutRef.current = null;
        scrollToIndexSafely(index);
      }, RETRY_DELAY);
    },
    [flatListRef, scrollToIndexSafely]
  );

  return { handlePressLetter, onScrollToIndexFailed };
}
