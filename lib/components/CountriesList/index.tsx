import React, { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  View,
  FlatList,
  ListRenderItem,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { CountryItem } from '../CountryItem';
import { AlphabeticFilter } from '../AlphabeticFilter';

import { t } from '../../utils/getTranslation';
import {
  ICountry,
  ICountryCca2,
  ICountrySelectLanguages,
  ICountrySelectStyle,
  IListItem,
  ISectionTitle,
  IThemeProps,
} from '../../interface';

import { useCountriesData } from '../../hooks/useCountriesData';
import { useActiveLetter } from '../../hooks/useActiveLetter';
import { useScrollToLetter } from '../../hooks/useScrollToLetter';

const FLATLIST_TUNING = {
  initialNumToRender: 30,
  maxToRenderPerBatch: 20,
  windowSize: 21,
  removeClippedSubviews: false,
  updateCellsBatchingPeriod: 25,
} as const;

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 50 };

const localStyles = StyleSheet.create({
  flex1: { flex: 1 },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const keyExtractor = (item: IListItem) =>
  'isSection' in item ? item.title : item.cca2;

export interface CountriesListProps extends IThemeProps {
  searchQuery: string;
  popularCountries: string[];
  visibleCountries: ICountryCca2[];
  hiddenCountries: ICountryCca2[];
  language: ICountrySelectLanguages;
  styles: {
    list: StyleProp<ViewStyle>;
    sectionTitle: StyleProp<TextStyle>;
    countryNotFoundContainer: StyleProp<ViewStyle>;
    countryNotFoundMessage: StyleProp<TextStyle>;
  };
  countrySelectStyle?: ICountrySelectStyle;
  isMultiSelect: boolean;
  selectedCountryCodes: Set<string>;
  onSelect: (country: ICountry) => void;
  customFlag?: (
    country: ICountry
  ) => React.ReactElement | null | undefined;
  countryItemComponent?: (item: ICountry) => React.ReactElement;
  sectionTitleComponent?: (item: ISectionTitle) => React.ReactElement;
  popularCountriesTitle?: string;
  allCountriesTitle?: string;
  showAlphabetFilter: boolean;
  showsVerticalScrollIndicator: boolean;
  countryNotFoundMessage?: string;
  accessibilityLabelCountriesList?: string;
  accessibilityHintCountriesList?: string;
  accessibilityLabelCountryItem?: string;
  accessibilityHintCountryItem?: string;
  accessibilityLabelAlphabetFilter?: string;
  accessibilityHintAlphabetFilter?: string;
  accessibilityLabelAlphabetLetter?: string;
  accessibilityHintAlphabetLetter?: string;
  allowFontScaling: boolean;
  visible: boolean;
  isLanguageReady: boolean;
}

export const CountriesList: React.FC<CountriesListProps> = ({
  visible,
  isLanguageReady,
  searchQuery,
  popularCountries,
  visibleCountries,
  hiddenCountries,
  language,
  theme = 'light',
  styles,
  countrySelectStyle,
  isMultiSelect,
  selectedCountryCodes,
  onSelect,
  customFlag,
  countryItemComponent,
  sectionTitleComponent,
  popularCountriesTitle,
  allCountriesTitle,
  showAlphabetFilter,
  showsVerticalScrollIndicator,
  countryNotFoundMessage,
  accessibilityLabelCountriesList,
  accessibilityHintCountriesList,
  accessibilityLabelCountryItem,
  accessibilityHintCountryItem,
  accessibilityLabelAlphabetFilter,
  accessibilityHintAlphabetFilter,
  accessibilityLabelAlphabetLetter,
  accessibilityHintAlphabetLetter,
  allowFontScaling,
}) => {
  const flatListRef = useRef<FlatList<IListItem>>(null);

  const { countriesList, allCountriesStartIndex } = useCountriesData({
    searchQuery,
    popularCountries,
    language,
    visibleCountries,
    hiddenCountries,
  });

  const {
    activeLetter,
    setActiveLetter,
    isProgrammaticScrollRef,
    onViewableItemsChanged,
    onMomentumScrollEnd,
    onScrollEndDrag,
    resetActiveLetter,
  } = useActiveLetter({
    countriesList,
    allCountriesStartIndex,
    language,
  });

  useEffect(() => {
    if (!visible) {
      resetActiveLetter();
    }
  }, [visible, resetActiveLetter]);

  const { handlePressLetter, onScrollToIndexFailed } = useScrollToLetter({
    flatListRef,
    countriesList,
    language,
    setActiveLetter,
    isProgrammaticScrollRef,
  });

  const isCountrySelected = useCallback(
    (cca2: string) => selectedCountryCodes.has(cca2),
    [selectedCountryCodes]
  );

  const renderItem: ListRenderItem<IListItem> = useCallback(
    ({ item, index }) => {
      if ('isSection' in item) {
        if (sectionTitleComponent) {
          return sectionTitleComponent(item);
        }
        const title =
          popularCountriesTitle && index === 0
            ? popularCountriesTitle
            : allCountriesTitle && index > 0
            ? allCountriesTitle
            : item.title;
        return (
          <Text
            testID="countrySelectSectionTitle"
            accessibilityRole="header"
            style={[styles.sectionTitle, countrySelectStyle?.sectionTitle]}
            allowFontScaling={allowFontScaling}
          >
            {title}
          </Text>
        );
      }

      const country = item as ICountry;
      const selected = isMultiSelect && isCountrySelected(country.cca2);
      return (
        <CountryItem
          country={country}
          isSelected={selected}
          onSelect={onSelect}
          theme={theme}
          language={language}
          countrySelectStyle={countrySelectStyle}
          customFlag={customFlag}
          countryItemComponent={countryItemComponent}
          accessibilityLabel={accessibilityLabelCountryItem}
          accessibilityHint={accessibilityHintCountryItem}
          allowFontScaling={allowFontScaling}
        />
      );
    },
    [
      styles.sectionTitle,
      countrySelectStyle,
      sectionTitleComponent,
      popularCountriesTitle,
      allCountriesTitle,
      allowFontScaling,
      isMultiSelect,
      isCountrySelected,
      onSelect,
      theme,
      language,
      customFlag,
      countryItemComponent,
      accessibilityLabelCountryItem,
      accessibilityHintCountryItem,
    ]
  );

  if (!isLanguageReady) {
    return (
      <View
        testID="countrySelectLanguageLoading"
        style={localStyles.loadingContainer}
      >
        <ActivityIndicator
          size="large"
          color={theme === 'dark' ? '#FFFFFF' : '#000000'}
        />
      </View>
    );
  }

  if (countriesList.length === 0) {
    return (
      <View style={localStyles.flex1}>
        <View
          style={[
            styles.countryNotFoundContainer,
            countrySelectStyle?.countryNotFoundContainer,
          ]}
        >
          <Text
            style={[
              styles.countryNotFoundMessage,
              countrySelectStyle?.countryNotFoundMessage,
            ]}
            allowFontScaling={allowFontScaling}
          >
            {countryNotFoundMessage || t('searchNotFoundMessage', language)}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={localStyles.flex1}>
        <FlatList
          ref={flatListRef}
          testID="countrySelectList"
          accessibilityRole="list"
          accessibilityLabel={
            accessibilityLabelCountriesList ||
            t('accessibilityLabelCountriesList', language)
          }
          accessibilityHint={
            accessibilityHintCountriesList ||
            t('accessibilityHintCountriesList', language)
          }
          data={countriesList}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          style={[styles.list, countrySelectStyle?.list]}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={VIEWABILITY_CONFIG}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollEndDrag={onScrollEndDrag}
          onScrollToIndexFailed={onScrollToIndexFailed}
          {...FLATLIST_TUNING}
        />
      </View>
      {showAlphabetFilter && (
        <View>
          <AlphabeticFilter
            activeLetter={activeLetter}
            onPressLetter={handlePressLetter}
            theme={theme}
            language={language}
            countries={countriesList}
            allCountriesStartIndex={allCountriesStartIndex}
            countrySelectStyle={countrySelectStyle}
            accessibilityLabelAlphabetFilter={
              accessibilityLabelAlphabetFilter
            }
            accessibilityHintAlphabetFilter={
              accessibilityHintAlphabetFilter
            }
            accessibilityLabelAlphabetLetter={
              accessibilityLabelAlphabetLetter
            }
            accessibilityHintAlphabetLetter={
              accessibilityHintAlphabetLetter
            }
            allowFontScaling={allowFontScaling}
          />
        </View>
      )}
    </>
  );
};
