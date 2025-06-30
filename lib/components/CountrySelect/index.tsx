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
  Text,
} from 'react-native';

import {CountryItem} from '../CountryItem';

import {createStyles} from '../styles';
import countries from '../../constants/countries.json';
import {translations} from '../../utils/getTranslation';
import {
  ICountry,
  ICountrySelectProps,
  ICountrySelectLanguages,
  IListItem,
} from '../../interface';

const DEFAULT_LANGUAGE: ICountrySelectLanguages = 'eng';

export const CountrySelect: React.FC<ICountrySelectProps> = ({
  visible,
  onClose,
  onSelect,
  theme = 'light',
  popularCountries = [],
  visibleCountries = [],
  hiddenCountries = [],
  language = DEFAULT_LANGUAGE,
  disabledBackdropPress,
  removedBackdrop,
  onBackdropPress,
  sectionTitleComponent,
  countryItemComponent,
  popularCountriesTitle,
  allCountriesTitle,
  showsVerticalScrollIndicator = false,
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

      if (visibleCountries.length > 0) {
        countriesData = (countries as unknown as ICountry[]).filter(country =>
          visibleCountries.includes(country.cca2),
        );
      }

      if (hiddenCountries.length > 0) {
        countriesData = (countries as unknown as ICountry[]).filter(
          country => !hiddenCountries.includes(country.cca2),
        );
      }

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

    if (visibleCountries.length > 0) {
      allCountries = (countries as unknown as ICountry[]).filter(country =>
        visibleCountries.includes(country.cca2),
      );
    }

    if (hiddenCountries.length > 0) {
      allCountries = (countries as unknown as ICountry[]).filter(
        country => !hiddenCountries.includes(country.cca2),
      );
    }

    const popularCountriesData = sortCountriesAlphabetically(
      allCountries.filter(country => popularCountries.includes(country.cca2)),
    );

    const otherCountriesData = sortCountriesAlphabetically(
      allCountries.filter(country => !popularCountries.includes(country.cca2)),
    );

    const result: IListItem[] = [];

    if (popularCountriesData.length > 0) {
      result.push({
        isSection: true as const,
        title:
          translations.popularCountriesTitle[
            language as ICountrySelectLanguages
          ],
      });
      result.push(...popularCountriesData);
      result.push({
        isSection: true as const,
        title:
          translations.allCountriesTitle[language as ICountrySelectLanguages],
      });
    }

    result.push(...otherCountriesData);

    return result;
  }, [
    searchQuery,
    popularCountries,
    language,
    visibleCountries,
    hiddenCountries,
  ]);

  const keyExtractor = useCallback(
    (item: IListItem) => ('isSection' in item ? item.title : item.cca2),
    [],
  );

  const renderItem: ListRenderItem<IListItem> = useCallback(
    ({item, index}) => {
      if ('isSection' in item) {
        if (sectionTitleComponent) {
          return sectionTitleComponent(item);
        }
        return (
          <Text
            testID="countrySelectSectionTitle"
            accessibilityRole="header"
            style={styles.sectionTitle}>
            {popularCountriesTitle && index === 0
              ? popularCountriesTitle
              : allCountriesTitle && index > 0
              ? allCountriesTitle
              : item.title}
          </Text>
        );
      }

      if (countryItemComponent) {
        return countryItemComponent(item as ICountry);
      }

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
    [
      onSelect,
      onClose,
      styles,
      language,
      countryItemComponent,
      sectionTitleComponent,
    ],
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
              showsVerticalScrollIndicator={
                showsVerticalScrollIndicator || false
              }
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
