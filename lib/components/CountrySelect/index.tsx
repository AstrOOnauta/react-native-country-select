/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Pressable,
  ListRenderItem,
  Modal,
} from 'react-native';

import {CountryItem} from '../CountryItem';

import {createStyles} from '../styles';
import countries from '../../constants/countries.json';
import {translations} from '../../utils/getTranslation';
import {
  ICountry,
  ICountrySelectProps,
  ICountrySelectLanguages,
} from '../../interface';

const DEFAULT_LANGUAGE: ICountrySelectLanguages = 'eng';

export const CountrySelect: React.FC<ICountrySelectProps> = ({
  visible,
  onClose,
  onSelect,
  theme = 'light',
  language = DEFAULT_LANGUAGE,
  disabledBackdropPress,
  removedBackdrop,
  onBackdropPress,
  ...props
}) => {
  const styles = createStyles(theme);

  const [searchQuery, setSearchQuery] = useState('');

  // Obtain the country name in the selected language
  const getCountryNameInLanguage = (country: ICountry): string => {
    return (
      country.translations[language]?.common ||
      country.translations[DEFAULT_LANGUAGE]?.common ||
      country.name.common ||
      ''
    );
  };

  // Normalize country name and remove accents
  const normalizeCountryName = (str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const sortCountriesAlphabetically = (
    countriesList: ICountry[],
  ): ICountry[] => {
    return [...countriesList].sort((a, b) => {
      const nameA = normalizeCountryName(
        getCountryNameInLanguage(a).toLowerCase(),
      );
      const nameB = normalizeCountryName(
        getCountryNameInLanguage(b).toLowerCase(),
      );
      return nameA.localeCompare(nameB);
    });
  };

  const getCountries = useMemo(() => {
    const query = searchQuery.toLowerCase();

    if (query.length > 0) {
      let countriesData = countries as unknown as ICountry[];

      const filteredCountries = countriesData.filter(country => {
        const countryName = getCountryNameInLanguage(country);
        const callingCode = country.idd.root.toLowerCase();
        const flag = country.flag.toLowerCase();
        return (
          countryName.includes(query) ||
          callingCode.includes(query) ||
          flag.includes(query)
        );
      });

      return sortCountriesAlphabetically(filteredCountries);
    }

    let allCountries = countries as unknown as ICountry[];

    const result: ICountry[] = allCountries;

    return result;
  }, [searchQuery]);

  const keyExtractor = useCallback((item: ICountry) => item.cca2, []);

  const renderItem: ListRenderItem<ICountry> = useCallback(
    ({item}) => {
      return (
        <CountryItem
          item={item as ICountry}
          onSelect={onSelect}
          onClose={onClose}
          theme={theme}
          language={language}
        />
      );
    },
    [onSelect, onClose, styles, language],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      {...props}>
      <Pressable
        style={[
          styles.backdrop,
          {alignItems: 'center', justifyContent: 'center'},
          removedBackdrop && {backgroundColor: 'transparent'},
        ]}
        disabled={disabledBackdropPress || removedBackdrop}
        onPress={onBackdropPress || onClose}>
        <Pressable style={styles.popupContainer}>
          <View style={styles.popupContent}>
            <View style={styles.searchContainer}>
              <TextInput
                testID="countrySelectSearchInput"
                accessibilityRole="text"
                accessibilityLabel="Country Select Search Input"
                accessibilityHint="Type to search for a country"
                style={styles.searchInput}
                placeholder={
                  translations.searchPlaceholder[
                    language as ICountrySelectLanguages
                  ]
                }
                placeholderTextColor={styles.searchInputPlaceholder.color}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <FlatList
              testID="countrySelectList"
              accessibilityRole="list"
              accessibilityLabel="Country Select List"
              accessibilityHint="List of countries"
              data={getCountries}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
