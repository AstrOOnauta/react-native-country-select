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
    modalType,
    countrySelectStyle,
  }) => {
    const styles = createStyles(theme);

    return (
      <TouchableOpacity
        testID="countrySelectItem"
        accessibilityRole="button"
        accessibilityLabel="Country Select Item"
        accessibilityHint="Click to select a country"
        style={[
          styles.countryItem,
          modalType === 'popup'
            ? countrySelectStyle?.popup?.countryItem
            : countrySelectStyle?.bottomSheet?.countryItem,
        ]}
        onPress={() => {
          onSelect(item);
          onClose();
        }}>
        <Text
          testID="countrySelectItemFlag"
          style={[
            styles.flag,
            modalType === 'popup'
              ? countrySelectStyle?.popup?.flag
              : countrySelectStyle?.bottomSheet?.flag,
          ]}>
          {item.flag}
        </Text>
        <View
          style={[
            styles.countryInfo,
            modalType === 'popup'
              ? countrySelectStyle?.popup?.countryInfo
              : countrySelectStyle?.bottomSheet?.countryInfo,
          ]}>
          <Text
            testID="countrySelectItemCallingCode"
            style={[
              styles.callingCode,
              modalType === 'popup'
                ? countrySelectStyle?.popup?.callingCode
                : countrySelectStyle?.bottomSheet?.callingCode,
            ]}>
            {item.idd.root}
          </Text>
          <Text
            testID="countrySelectItemName"
            style={[
              styles.countryName,
              modalType === 'popup'
                ? countrySelectStyle?.popup?.countryName
                : countrySelectStyle?.bottomSheet?.countryName,
            ]}>
            {item?.translations[language]?.common ||
              item?.translations[DEFAULT_LANGUAGE]?.common}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
);
