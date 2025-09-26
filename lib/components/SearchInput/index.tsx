import React from 'react';
import {TextInput} from 'react-native';

import {createStyles} from '../styles';
import {translations} from '../../utils/getTranslation';
import {ISearchInputProps, ICountrySelectLanguages} from '../../interface';

export const SearchInput: React.FC<ISearchInputProps> = ({
  theme,
  language,
  value,
  onChangeText,
  countrySelectStyle,
  searchPlaceholder,
  searchPlaceholderTextColor,
  searchSelectionColor,
  accessibilityLabelSearchInput,
  accessibilityHintSearchInput,
}) => {
  const styles = createStyles(theme);
  return (
    <TextInput
      testID="countrySelectSearchInput"
      accessibilityRole="text"
      accessibilityLabel={
        accessibilityLabelSearchInput ||
        translations.accessibilityLabelSearchInput[language]
      }
      accessibilityHint={
        accessibilityHintSearchInput ||
        translations.accessibilityHintSearchInput[language]
      }
      style={[styles.searchInput, countrySelectStyle?.searchInput]}
      placeholder={
        searchPlaceholder ||
        translations.searchPlaceholder[language as ICountrySelectLanguages]
      }
      placeholderTextColor={
        searchPlaceholderTextColor ||
        (theme === 'dark' ? '#FFFFFF80' : '#00000080')
      }
      selectionColor={searchSelectionColor}
      value={value}
      onChangeText={onChangeText}
    />
  );
};
