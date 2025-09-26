import React, {memo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import {createStyles} from '../styles';
import {translations} from '../../utils/getTranslation';
import {ICountryItemProps, ICountrySelectLanguages} from '../../interface';

const DEFAULT_LANGUAGE: ICountrySelectLanguages = 'eng';

export const CountryItem = memo<ICountryItemProps>(
  ({
    item,
    onSelect,
    onClose,
    theme = 'light',
    language,
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
            ` ${
              item.translations[language]?.common ||
              item.translations[DEFAULT_LANGUAGE]?.common
            }`
        }
        accessibilityHint={
          accessibilityHint ||
          translations.accessibilityHintCountryItem[language] +
            ` ${
              item.translations[language]?.common ||
              item.translations[DEFAULT_LANGUAGE]?.common
            }`
        }
        style={[styles.countryItem, countrySelectStyle?.countryItem]}
        onPress={() => {
          onSelect(item);
          onClose();
        }}>
        <Text
          testID="countrySelectItemFlag"
          style={[styles.flag, countrySelectStyle?.flag]}>
          {item.flag || item.cca2}
        </Text>
        <View style={[styles.countryInfo, countrySelectStyle?.countryInfo]}>
          <Text
            testID="countrySelectItemCallingCode"
            style={[styles.callingCode, countrySelectStyle?.callingCode]}>
            {item.idd.root}
          </Text>
          <Text
            testID="countrySelectItemName"
            style={[styles.countryName, countrySelectStyle?.countryName]}>
            {item?.translations[language]?.common ||
              item?.translations[DEFAULT_LANGUAGE]?.common}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);
