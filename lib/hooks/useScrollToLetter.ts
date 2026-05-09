import { MutableRefObject, useCallback, useRef } from 'react';
import { FlatList } from 'react-native';

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

export function useScrollToLetter({
  flatListRef,
  countriesList,
  language,
  setActiveLetter,
  isProgrammaticScrollRef,
}: UseScrollToLetterParams) {
  const averageItemLengthRef = useRef(0);

  const handlePressLetter = useCallback(
    (index: number) => {
      isProgrammaticScrollRef.current = true;

      let computedLetter: string | null = null;
      for (let i = index; i < countriesList.length; i++) {
        const item = countriesList[i];
        if (!('isSection' in item)) {
          const name =
            (item as ICountry)?.translations[language]?.common || '';
          if (name) {
            computedLetter = name[0].toUpperCase();
          }
          break;
        }
      }
      if (computedLetter) {
        setActiveLetter(computedLetter);
      }

      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0,
      });
    },
    [
      countriesList,
      language,
      flatListRef,
      setActiveLetter,
      isProgrammaticScrollRef,
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
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0,
        });
      }, 50);
    },
    [flatListRef]
  );

  return { handlePressLetter, onScrollToIndexFailed };
}
