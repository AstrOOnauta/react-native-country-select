import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { createStyles } from '../styles';
import { translations } from '../../utils/getTranslation';
import { ICountryItemProps } from '../../interface';

export const CountryItem = memo<ICountryItemProps>(
  ({
    country,
    isSelected,
    onSelect,
    theme = 'light',
    language = 'eng',
    countrySelectStyle,
    countryItemComponent,
    customFlag,
    accessibilityLabel,
    accessibilityHint,
    allowFontScaling = true,
  }) => {
    const styles = useMemo(() => createStyles(theme), [theme]);
    const handlePress = useCallback(() => onSelect(country), [
      onSelect,
      country,
    ]);

    const customFlagElement = customFlag ? customFlag(country) : null;
    const hasCustomFlag =
      customFlagElement !== undefined && customFlagElement !== null;

    const commonName = country.translations[language]?.common;

    return (
      <TouchableOpacity
        testID="countrySelectItem"
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabel ||
          translations.accessibilityLabelCountryItem[language] +
            ` ${commonName}`
        }
        accessibilityHint={
          accessibilityHint ||
          translations.accessibilityHintCountryItem[language] +
            ` ${commonName}`
        }
        onPress={handlePress}
      >
        {countryItemComponent ? (
          countryItemComponent(country)
        ) : (
          <View
            style={[
              styles.countryItem,
              countrySelectStyle?.countryItem,
              isSelected && styles.countryItemSelected,
            ]}
          >
            {hasCustomFlag ? (
              customFlagElement
            ) : (
              <Text
                testID="countrySelectItemFlag"
                style={[styles.flag, countrySelectStyle?.flag]}
                allowFontScaling={allowFontScaling}
              >
                {country.flag || country.cca2}
              </Text>
            )}
            <View
              style={[
                styles.countryInfo,
                countrySelectStyle?.countryInfo,
              ]}
            >
              <Text
                testID="countrySelectItemCallingCode"
                style={[
                  styles.callingCode,
                  countrySelectStyle?.callingCode,
                  isSelected && styles.callingCodeSelected,
                ]}
                allowFontScaling={allowFontScaling}
              >
                {country.idd.root}
              </Text>
              <Text
                testID="countrySelectItemName"
                style={[
                  styles.countryName,
                  countrySelectStyle?.countryName,
                  isSelected && styles.countryNameSelected,
                ]}
                allowFontScaling={allowFontScaling}
              >
                {commonName}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }
);
