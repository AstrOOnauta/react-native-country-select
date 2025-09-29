/* eslint-disable no-undef-init */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useMemo, useRef} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';

import {createStyles} from '../styles';
import {translations} from '../../utils/getTranslation';
import {createAlphabet} from '../../utils/createAlphabet';
import {AlphabeticFilterProps} from '../../interface/alfabeticFilterProps';
import {normalizeCountryName} from '../../utils/normalizeCountryName';

const ALPHABET_VIEWPORT_HEIGHT = 0;
const ALPHABET_ITEM_SIZE = 28;
const ALPHABET_VERTICAL_PADDING = 12;

export const AlphabeticFilter: React.FC<AlphabeticFilterProps> = ({
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
}) => {
  const styles = createStyles(theme);
  const alphabetScrollRef = useRef<ScrollView>(null);

  const letterIndexMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (let i = allCountriesStartIndex; i < countries.length; i++) {
      const item = countries[i];
      if ('isSection' in item) {
        continue;
      }
      const country: any = item as any;
      // Use English/common name to anchor alphabet jumps consistently
      const name = country?.name?.common || '';
      const first = (name?.[0] || '').toUpperCase();
      if (first && map[first] === undefined) {
        map[first] = i;
      }
    }
    return map;
  }, [countries, allCountriesStartIndex, language]);

  const alphabet = createAlphabet();

  const scrollAlphabetToLetter = (letter: string) => {
    const letterIdx = alphabet.indexOf(letter);
    if (letterIdx >= 0) {
      const centerOffset = Math.max(
        0,
        ALPHABET_VIEWPORT_HEIGHT / 2 - ALPHABET_ITEM_SIZE / 2,
      );
      const y = Math.max(
        0,
        letterIdx * ALPHABET_ITEM_SIZE -
          centerOffset +
          ALPHABET_VERTICAL_PADDING,
      );
      alphabetScrollRef.current?.scrollTo({y, animated: true});
    }
  };

  useEffect(() => {
    if (!activeLetter) {
      return;
    }
    scrollAlphabetToLetter(activeLetter);
  }, [activeLetter, alphabet]);

  return (
    <ScrollView
      testID="countrySelectAlphabetFilter"
      accessibilityRole="list"
      accessibilityLabel={
        accessibilityLabelAlphabetFilter ||
        translations.accessibilityLabelAlphabetFilter[language]
      }
      accessibilityHint={
        accessibilityHintAlphabetFilter ||
        translations.accessibilityHintAlphabetFilter[language]
      }
      ref={alphabetScrollRef}
      style={[styles.alphabetContainer, countrySelectStyle?.alphabetContainer]}
      contentContainerStyle={{alignItems: 'center', paddingVertical: 12}}
      showsVerticalScrollIndicator={false}>
      {alphabet.map(letter => {
        const enabled = letterIndexMap[letter] !== undefined;
        const isActive = activeLetter === letter;
        if (enabled) {
          return (
            <TouchableOpacity
              key={letter}
              onPress={() => {
                // Compute first index for this letter using normalized display name (same as sorting)
                const lower = letter.toLowerCase();
                let idxToGo: number | undefined = undefined;
                for (
                  let i = allCountriesStartIndex;
                  i < countries.length;
                  i++
                ) {
                  const it = countries[i] as any;
                  if ('isSection' in it) {
                    continue;
                  }
                  const displayName =
                    it?.translations?.[language]?.common ||
                    it?.name?.common ||
                    '';
                  const normalized = normalizeCountryName(
                    displayName.toLowerCase(),
                  );
                  if (normalized.startsWith(lower)) {
                    idxToGo = i;
                    break;
                  }
                }
                if (idxToGo !== undefined) {
                  onPressLetter(idxToGo);
                }
                scrollAlphabetToLetter(letter);
              }}
              style={[
                styles.alphabetLetter,
                isActive && styles.alphabetLetterActive,
                countrySelectStyle?.alphabetLetter,
              ]}
              accessibilityRole="button"
              accessibilityHint={
                accessibilityHintAlphabetLetter ||
                translations.accessibilityHintAlphabetLetter[language] +
                  ` ${letter}`
              }
              accessibilityLabel={
                accessibilityLabelAlphabetLetter ||
                translations.accessibilityLabelAlphabetLetter[language] +
                  ` ${letter}`
              }>
              <Text
                style={[
                  styles.alphabetLetterText,
                  isActive && styles.alphabetLetterTextActive,
                  countrySelectStyle?.alphabetLetterText,
                ]}>
                {letter}
              </Text>
            </TouchableOpacity>
          );
        }
        return (
          <View
            key={letter}
            style={[
              styles.alphabetLetter,
              styles.alphabetLetterDisabled,
              countrySelectStyle?.alphabetLetter,
            ]}>
            <Text
              style={[
                styles.alphabetLetterText,
                styles.alphabetLetterTextDisabled,
                countrySelectStyle?.alphabetLetterText,
              ]}>
              {letter}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default AlphabeticFilter;
