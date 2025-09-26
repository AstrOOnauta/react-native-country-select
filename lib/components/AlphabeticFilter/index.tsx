/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useMemo, useRef} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';

import {createStyles} from '../styles';
import {translations} from '../../utils/getTranslation';
import {AlphabeticFilterProps} from '../../interface/alfabeticFilterProps';

const ALPHABET_VIEWPORT_HEIGHT = 0;
const ALPHABET_ITEM_SIZE = 28;
const ALPHABET_VERTICAL_PADDING = 12;

export const AlphabeticFilter: React.FC<AlphabeticFilterProps> = ({
  alphabet,
  activeLetter,
  letterToIndex,
  onPressLetter,
  theme = 'light',
  language,
  countrySelectStyle,
  accessibilityLabelAlphabetFilter,
  accessibilityHintAlphabetFilter,
  accessibilityLabelAlphabetLetter,
  accessibilityHintAlphabetLetter,
}) => {
  const styles = createStyles(theme);
  const alphabetScrollRef = useRef<ScrollView>(null);

  const letterIndexMap = useMemo(() => letterToIndex, [letterToIndex]);

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
                onPressLetter(letter);
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
