import React, {memo} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import {createStyles} from '../styles';
import {ICountryItemProps, ICountrySelectLanguages} from '../../interface';

const DEFAULT_LANGUAGE: ICountrySelectLanguages = 'eng';

export const CountryItem = memo<ICountryItemProps>(
  ({item, onSelect, onClose, theme = 'light', language}) => {
    const styles = createStyles(theme);

    return (
      <TouchableOpacity
        testID="countrySelectItem"
        accessibilityRole="button"
        accessibilityLabel="Country Select Item"
        accessibilityHint="Click to select a country"
        style={styles.countryItem}
        onPress={() => {
          onSelect(item);
          onClose();
        }}>
        <Text testID="countrySelectItemFlag" style={styles.flag}>
          {item.flag}
        </Text>
        <View style={styles.countryInfo}>
          <Text
            testID="countrySelectItemCallingCode"
            style={styles.callingCode}>
            {item.idd.root}
          </Text>
          <Text testID="countrySelectItemName" style={styles.countryName}>
            {item?.translations[language]?.common ||
              item?.translations[DEFAULT_LANGUAGE]?.common}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);
