import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { createStyles } from '../styles';
import { t } from '../../utils/getTranslation';
import { createAlphabet } from '../../utils/createAlphabet';
import { AlphabeticFilterProps } from '../../interface/alfabeticFilterProps';
import { normalizeCountryName } from '../../utils/normalizeCountryName';
import { getCountryName } from '../../utils/getCountryName';
import { ICountry, ICountrySelectLanguages, IListItem } from '../../interface';

const ALPHABET = createAlphabet();
const ALPHABET_VIEWPORT_HEIGHT = 0;
const ALPHABET_ITEM_SIZE = 28;
const ALPHABET_VERTICAL_PADDING = 12;
const SCROLL_CENTER_OFFSET = Math.max(
  0,
  ALPHABET_VIEWPORT_HEIGHT / 2 - ALPHABET_ITEM_SIZE / 2
);

const localStyles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
});

interface LetterEntry {
  letter: string;
  enabled: boolean;
  index: number;
}

function buildLetterEntries(
  countries: IListItem[],
  allCountriesStartIndex: number,
  language: ICountrySelectLanguages
): LetterEntry[] {
  const map: Record<string, number> = {};
  for (let i = allCountriesStartIndex; i < countries.length; i++) {
    const item = countries[i];
    if ('isSection' in item) continue;
    const country = item as ICountry;
    const displayName = getCountryName(country, language);
    if (!displayName) continue;
    const normalized = normalizeCountryName(displayName.toLowerCase());
    const first = (normalized[0] || '').toUpperCase();
    if (first && map[first] === undefined) {
      map[first] = i;
    }
  }
  return ALPHABET.map((letter) => ({
    letter,
    enabled: map[letter] !== undefined,
    index: map[letter] ?? -1,
  }));
}

export const AlphabeticFilter = memo<AlphabeticFilterProps>(
  ({
    activeLetter,
    onPressLetter,
    theme = 'light',
    language,
    countries,
    allCountriesStartIndex,
    countrySelectStyle,
    accessibilityLabelAlphabetFilter,
    accessibilityHintAlphabetFilter,
    accessibilityLabelAlphabetLetter,
    accessibilityHintAlphabetLetter,
    allowFontScaling = true,
  }) => {
    const styles = useMemo(() => createStyles(theme), [theme]);
    const alphabetScrollRef = useRef<ScrollView>(null);

    const letterEntries = useMemo(
      () =>
        buildLetterEntries(countries, allCountriesStartIndex, language),
      [countries, allCountriesStartIndex, language]
    );

    const scrollAlphabetToLetter = useCallback((letter: string) => {
      const letterIdx = ALPHABET.indexOf(letter);
      if (letterIdx < 0) return;
      const y = Math.max(
        0,
        letterIdx * ALPHABET_ITEM_SIZE -
          SCROLL_CENTER_OFFSET +
          ALPHABET_VERTICAL_PADDING
      );
      alphabetScrollRef.current?.scrollTo({ y, animated: true });
    }, []);

    useEffect(() => {
      if (!activeLetter) return;
      scrollAlphabetToLetter(activeLetter);
    }, [activeLetter, scrollAlphabetToLetter]);

    return (
      <ScrollView
        testID="countrySelectAlphabetFilter"
        accessibilityRole="list"
        accessibilityLabel={
          accessibilityLabelAlphabetFilter ||
          t('accessibilityLabelAlphabetFilter', language)
        }
        accessibilityHint={
          accessibilityHintAlphabetFilter ||
          t('accessibilityHintAlphabetFilter', language)
        }
        ref={alphabetScrollRef}
        style={[
          styles.alphabetContainer,
          countrySelectStyle?.alphabetContainer,
        ]}
        contentContainerStyle={localStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {letterEntries.map(({ letter, enabled, index }) => {
          const isActive = activeLetter === letter;
          if (!enabled) {
            return (
              <View
                key={letter}
                style={[
                  styles.alphabetLetter,
                  styles.alphabetLetterDisabled,
                  countrySelectStyle?.alphabetLetter,
                  countrySelectStyle?.alphabetLetterDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.alphabetLetterText,
                    styles.alphabetLetterTextDisabled,
                    countrySelectStyle?.alphabetLetterText,
                    countrySelectStyle?.alphabetLetterTextDisabled,
                  ]}
                  allowFontScaling={allowFontScaling}
                >
                  {letter}
                </Text>
              </View>
            );
          }
          return (
            <TouchableOpacity
              key={letter}
              onPress={() => {
                onPressLetter(index);
                scrollAlphabetToLetter(letter);
              }}
              style={[
                styles.alphabetLetter,
                isActive && styles.alphabetLetterActive,
                countrySelectStyle?.alphabetLetter,
                isActive && countrySelectStyle?.alphabetLetterActive,
              ]}
              accessibilityRole="button"
              accessibilityHint={
                accessibilityHintAlphabetLetter ||
                `${t('accessibilityHintAlphabetLetter', language)} ${letter}`
              }
              accessibilityLabel={
                accessibilityLabelAlphabetLetter ||
                `${t('accessibilityLabelAlphabetLetter', language)} ${letter}`
              }
            >
              <Text
                style={[
                  styles.alphabetLetterText,
                  isActive && styles.alphabetLetterTextActive,
                  countrySelectStyle?.alphabetLetterText,
                  isActive && countrySelectStyle?.alphabetLetterTextActive,
                ]}
                allowFontScaling={allowFontScaling}
              >
                {letter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }
);

export default AlphabeticFilter;
