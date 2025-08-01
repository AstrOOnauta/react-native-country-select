import React, {memo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import {createStyles} from '../styles';
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
  }) => {
    const styles = createStyles(theme);

    return (
      <TouchableOpacity
        testID="countrySelectItem"
        accessibilityRole="button"
        accessibilityLabel="Country Select Item"
        accessibilityHint="Click to select a country"
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
