import React, {memo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import {createStyles} from '../styles';
import {translations} from '../../utils/getTranslation';
import {ICountryItemProps} from '../../interface';

export const CountryItem = memo<ICountryItemProps>(
  ({
    country,
    isSelected,
    onSelect,
    theme = 'light',
    language = 'eng',
    countrySelectStyle,
    accessibilityLabel,
    accessibilityHint,
  }) => {
    const styles = createStyles(theme);

    return (
      <TouchableOpacity
        testID="countrySelectItem"
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabel ||
          translations.accessibilityLabelCountryItem[language] +
            ` ${country.translations[language]?.common}`
        }
        accessibilityHint={
          accessibilityHint ||
          translations.accessibilityHintCountryItem[language] +
            ` ${country.translations[language]?.common}`
        }
        style={[
          styles.countryItem,
          countrySelectStyle?.countryItem,
          isSelected && styles.countryItemSelected,
        ]}
        onPress={() => onSelect(country)}>
        <Text
          testID="countrySelectItemFlag"
          style={[styles.flag, countrySelectStyle?.flag]}>
          {country.flag || country.cca2}
        </Text>
        <View style={[styles.countryInfo, countrySelectStyle?.countryInfo]}>
          <Text
            testID="countrySelectItemCallingCode"
            style={[
              styles.callingCode,
              countrySelectStyle?.callingCode,
              isSelected && styles.callingCodeSelected,
            ]}>
            {country.idd.root}
          </Text>
          <Text
            testID="countrySelectItemName"
            style={[
              styles.countryName,
              countrySelectStyle?.countryName,
              isSelected && styles.countryNameSelected,
            ]}>
            {country?.translations[language]?.common}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);
