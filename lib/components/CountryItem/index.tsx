import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { createStyles } from '../styles';
import { t } from '../../utils/getTranslation';
import { getCountryName } from '../../utils/getCountryName';
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

    const commonName = getCountryName(country, language);

    return (
      <TouchableOpacity
        testID={`countrySelectItem-${country.cca2}`}
        accessibilityRole="button"
        accessibilityState={{ selected: !!isSelected }}
        accessibilityLabel={
          accessibilityLabel ||
          `${t('accessibilityLabelCountryItem', language)} ${commonName}`
        }
        accessibilityHint={
          accessibilityHint ||
          `${t('accessibilityHintCountryItem', language)} ${commonName}`
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
                testID={`countrySelectItemFlag-${country.cca2}`}
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
                testID={`countrySelectItemCallingCode-${country.cca2}`}
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
                testID={`countrySelectItemName-${country.cca2}`}
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
