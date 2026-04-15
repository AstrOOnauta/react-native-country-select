import React, { useState } from 'react';
import { TextInput } from 'react-native';

import { createStyles } from '../styles';
import { translations } from '../../utils/getTranslation';
import { ISearchInputProps, ICountrySelectLanguages } from '../../interface';

export const SearchInput: React.FC<ISearchInputProps> = ({
  theme = 'light',
  language,
  value,
  onChangeText,
  countrySelectStyle,
  searchPlaceholder,
  searchPlaceholderTextColor,
  searchSelectionColor,
  searchFocusedBorderColor,
  accessibilityLabelSearchInput,
  accessibilityHintSearchInput,
  allowFontScaling = true,
}) => {
  const styles = createStyles(theme);
  const [isFocused, setIsFocused] = useState(false);

  const focusedBorderColor = searchFocusedBorderColor || theme === 'dark' ? '#60A5FA' : '#3B82F6';

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
      style={[styles.searchInput, countrySelectStyle?.searchInput, isFocused && { borderColor: focusedBorderColor }]}
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
      allowFontScaling={allowFontScaling}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
};
