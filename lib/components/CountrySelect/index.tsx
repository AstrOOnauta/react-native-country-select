/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo, useState, useRef } from 'react';
import { View, FlatList, ListRenderItem, Text } from 'react-native';

import { PopupModal } from '../PopupModal';
import { CountryItem } from '../CountryItem';
import { CloseButton } from '../CloseButton';
import { SearchInput } from '../SearchInput';
import { FullscreenModal } from '../FullscreenModal';
import { BottomSheetModal } from '../BottomSheetModal';
import { AlphabeticFilter } from '../AlphabeticFilter';

import { createStyles } from '../styles';
import { translations } from '../../utils/getTranslation';
import { getCountriesList } from '../../utils/getCountriesList';
import {
  ICountry,
  ICountrySelectProps,
  ICountrySelectLanguages,
  IListItem,
  IThemeProps,
} from '../../interface';

export const CountrySelect: React.FC<ICountrySelectProps> = ({
  visible,
  onClose,
  onSelect,
  modalType = 'bottomSheet',
  theme = 'light',
  isMultiSelect = false,
  isFullScreen = false,
  countrySelectStyle,
  popularCountries = [],
  visibleCountries = [],
  hiddenCountries = [],
  language = 'eng',
  showSearchInput = true,
  showAlphabetFilter = false,
  searchPlaceholder,
  searchPlaceholderTextColor,
  searchSelectionColor,
  showCloseButton = false,
  minBottomsheetHeight,
  maxBottomsheetHeight,
  initialBottomsheetHeight,
  disabledBackdropPress,
  removedBackdrop,
  onBackdropPress,
  dragHandleIndicatorComponent,
  sectionTitleComponent,
  countryItemComponent,
  closeButtonComponent,
  customFlag,
  popularCountriesTitle,
  allCountriesTitle,
  showsVerticalScrollIndicator = false,
  countryNotFoundMessage,
  accessibilityLabelBackdrop,
  accessibilityHintBackdrop,
  accessibilityLabelCloseButton,
  accessibilityHintCloseButton,
  accessibilityLabelSearchInput,
  accessibilityHintSearchInput,
  accessibilityLabelCountriesList,
  accessibilityHintCountriesList,
  accessibilityLabelCountryItem,
  accessibilityHintCountryItem,
  accessibilityLabelAlphabetFilter,
  accessibilityHintAlphabetFilter,
  accessibilityLabelAlphabetLetter,
  accessibilityHintAlphabetLetter,
  allowFontScaling = true,
  ...props
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(
    null
  );

  const flatListRef = useRef<FlatList<IListItem>>(null);
  const isProgrammaticScroll = useRef(false);

  const styles = createStyles(theme, modalType, isFullScreen);
  const selectedCountries =
    isMultiSelect && 'selectedCountries' in props
      ? props.selectedCountries ?? []
      : [];

  const countriesList = useMemo(() => {
    return getCountriesList({
      searchQuery,
      popularCountries,
      language,
      visibleCountries,
      hiddenCountries,
    });
  }, [
    searchQuery,
    popularCountries,
    language,
    visibleCountries,
    hiddenCountries,
  ]);

  // Compute the index right after the "All Countries" section header (independent of localized/custom title)
  const allCountriesStartIndex = useMemo(() => {
    // Collect indices of section headers
    const sectionIndices: number[] = [];
    for (let i = 0; i < countriesList.length; i++) {
      if ('isSection' in countriesList[i]) {
        sectionIndices.push(i);
      }
    }
    // If there are at least two sections, the second one corresponds to "All Countries"
    if (sectionIndices.length >= 2) {
      return sectionIndices[1] + 1;
    }
    // Otherwise, list has no popular section; start at top
    return 0;
  }, [countriesList]);

  const keyExtractor = useCallback(
    (item: IListItem) =>
      'isSection' in item ? item.title : item.cca2,
    []
  );

  const handlePressLetter = useCallback(
    (index: number) => {
      // Mark programmatic scroll to avoid onViewableItemsChanged flicker
      isProgrammaticScroll.current = true;

      // Pre-set active letter immediately based on the first non-section item at or after index
      let computedLetter: string | null = null;
      for (let i = index; i < countriesList.length; i++) {
        const item = countriesList[i];
        if (!('isSection' in item)) {
          const name =
            (item as ICountry)?.translations[language]?.common || '';
          if (name) {
            computedLetter = name[0].toUpperCase();
          }
          break;
        }
      }
      if (computedLetter) {
        setActiveLetter(computedLetter);
      }

      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0,
      });
    },
    [countriesList, language]
  );

  const handleCloseModal = () => {
    setSearchQuery('');
    setActiveLetter(null);
    onClose();
  };

  // Memoized set of selected country codes for fast lookups
  const selectedCountryCodes = useMemo(() => {
    if (selectedCountries.length === 0) {
      return new Set<string>();
    }
    const set = new Set<string>();
    for (const c of selectedCountries) {
      set.add(c.cca2);
    }
    return set;
  }, [selectedCountries]);

  const isCountrySelected = useCallback(
    (cca2: string) => selectedCountryCodes.has(cca2),
    [selectedCountryCodes]
  );

  const handleSelectCountry = useCallback(
    (country: ICountry) => {
      const countryWithCustomFlag = customFlag
        ? {
            ...country,
            customFlag: customFlag(country),
          }
        : country;

      if (isMultiSelect) {
        if (isCountrySelected(country.cca2)) {
          (onSelect as (countries: ICountry[]) => void)(
            selectedCountries.filter((c) => c.cca2 !== country.cca2)
          );
          return;
        }
        (onSelect as (countries: ICountry[]) => void)([
          ...selectedCountries,
          countryWithCustomFlag,
        ]);
        return;
      }

      (onSelect as (country: ICountry) => void)(
        countryWithCustomFlag
      );
      onClose();
    },
    [isMultiSelect, isCountrySelected, selectedCountries, customFlag]
  );

  const renderCloseButton = () => {
    if (closeButtonComponent) {
      return closeButtonComponent();
    }
    return (
      <CloseButton
        theme={theme as IThemeProps}
        language={language}
        onClose={handleCloseModal}
        countrySelectStyle={countrySelectStyle}
        accessibilityLabelCloseButton={accessibilityLabelCloseButton}
        accessibilityHintCloseButton={accessibilityHintCloseButton}
        allowFontScaling={allowFontScaling}
      />
    );
  };

  const renderSearchInput = () => (
    <SearchInput
      theme={theme as IThemeProps}
      language={language}
      value={searchQuery}
      onChangeText={setSearchQuery}
      countrySelectStyle={countrySelectStyle}
      searchPlaceholder={searchPlaceholder}
      searchPlaceholderTextColor={searchPlaceholderTextColor}
      searchSelectionColor={searchSelectionColor}
      accessibilityLabelSearchInput={accessibilityLabelSearchInput}
      accessibilityHintSearchInput={accessibilityHintSearchInput}
      allowFontScaling={allowFontScaling}
    />
  );

  const onViewableItemsChanged = useRef(
    ({
      viewableItems,
    }: {
      viewableItems: Array<{ item: IListItem; index: number | null }>;
    }) => {
      if (isProgrammaticScroll.current) {
        // Ignore transient updates while we are animating to a specific index
        return;
      }
      let updated: string | null = null;
      for (const v of viewableItems) {
        const it = v.item;
        const idx = v.index ?? -1;
        if (!('isSection' in it) && idx >= allCountriesStartIndex) {
          const name =
            (it as ICountry)?.translations[language]?.common || '';
          if (name) {
            updated = name[0].toUpperCase();
          }
          break;
        }
      }
      setActiveLetter(updated);
    }
  ).current;

  const renderFlatList = () => {
    if (countriesList.length === 0) {
      return (
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
            {countryNotFoundMessage ||
              translations.searchNotFoundMessage[
                language as ICountrySelectLanguages
              ]}
          </Text>
        </View>
      );
    }
    return (
      <FlatList
        ref={flatListRef}
        testID="countrySelectList"
        accessibilityRole="list"
        accessibilityLabel={
          accessibilityLabelCountriesList ||
          translations.accessibilityLabelCountriesList[language]
        }
        accessibilityHint={
          accessibilityHintCountriesList ||
          translations.accessibilityHintCountriesList[language]
        }
        data={countriesList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          showsVerticalScrollIndicator || false
        }
        style={[styles.list, countrySelectStyle?.list]}
        onViewableItemsChanged={onViewableItemsChanged}
        onMomentumScrollEnd={() => {
          isProgrammaticScroll.current = false;
        }}
        onScrollEndDrag={() => {
          // Fallback if momentum does not trigger
          isProgrammaticScroll.current = false;
        }}
        onScrollToIndexFailed={({ index, averageItemLength }) => {
          // Simple recovery: estimate offset, then retry scrollToIndex after measurement
          const estimatedOffset = Math.max(
            0,
            (averageItemLength || 0) * index
          );
          flatListRef.current?.scrollToOffset({
            offset: estimatedOffset,
            animated: false,
          });
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index,
              animated: true,
              viewPosition: 0,
            });
          }, 100);
        }}
      />
    );
  };

  const renderItem: ListRenderItem<IListItem> = useCallback(
    ({ item, index }) => {
      if ('isSection' in item) {
        if (sectionTitleComponent) {
          return sectionTitleComponent(item);
        }
        return (
          <Text
            testID="countrySelectSectionTitle"
            accessibilityRole="header"
            style={[
              styles.sectionTitle,
              countrySelectStyle?.sectionTitle,
            ]}
            allowFontScaling={allowFontScaling}
          >
            {popularCountriesTitle && index === 0
              ? popularCountriesTitle
              : allCountriesTitle && index > 0
              ? allCountriesTitle
              : item.title}
          </Text>
        );
      }

      const countryItem = item as ICountry;
      const selected =
        isMultiSelect && isCountrySelected(countryItem.cca2);
      return (
        <CountryItem
          country={countryItem}
          isSelected={selected}
          onSelect={handleSelectCountry}
          theme={theme as IThemeProps}
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
      styles,
      language,
      countryItemComponent,
      sectionTitleComponent,
      isMultiSelect,
      isCountrySelected,
    ]
  );

  const renderAlphabetFilter = () => {
    return (
      <AlphabeticFilter
        activeLetter={activeLetter}
        onPressLetter={handlePressLetter}
        theme={theme as IThemeProps}
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
    );
  };

  const HeaderModal =
    showSearchInput || showCloseButton ? (
      <View
        style={[
          styles.searchContainer,
          countrySelectStyle?.searchContainer,
        ]}
      >
        {(showCloseButton || isFullScreen) && renderCloseButton()}
        {showSearchInput && renderSearchInput()}
      </View>
    ) : null;

  const ContentModal = (
    <>
      <View style={{ flex: 1 }}>{renderFlatList()}</View>
      {showAlphabetFilter && <View>{renderAlphabetFilter()}</View>}
    </>
  );

  if (modalType === 'popup' || isFullScreen) {
    if (isFullScreen) {
      return (
        <FullscreenModal
          visible={visible}
          onRequestClose={handleCloseModal}
          statusBarTranslucent
          removedBackdrop={removedBackdrop}
          disabledBackdropPress={disabledBackdropPress}
          onBackdropPress={onBackdropPress}
          accessibilityLabelBackdrop={
            accessibilityLabelBackdrop ||
            translations.accessibilityLabelBackdrop[language]
          }
          accessibilityHintBackdrop={
            accessibilityHintBackdrop ||
            translations.accessibilityHintBackdrop[language]
          }
          styles={styles}
          countrySelectStyle={countrySelectStyle}
          header={HeaderModal}
          {...props}
        >
          {ContentModal}
        </FullscreenModal>
      );
    }

    return (
      <PopupModal
        visible={visible}
        onRequestClose={handleCloseModal}
        statusBarTranslucent
        removedBackdrop={removedBackdrop}
        disabledBackdropPress={disabledBackdropPress}
        onBackdropPress={onBackdropPress}
        accessibilityLabelBackdrop={
          accessibilityLabelBackdrop ||
          translations.accessibilityLabelBackdrop[language]
        }
        accessibilityHintBackdrop={
          accessibilityHintBackdrop ||
          translations.accessibilityHintBackdrop[language]
        }
        styles={styles}
        countrySelectStyle={countrySelectStyle}
        header={HeaderModal}
        {...props}
      >
        {ContentModal}
      </PopupModal>
    );
  }

  return (
    <BottomSheetModal
      visible={visible}
      onRequestClose={handleCloseModal}
      statusBarTranslucent
      removedBackdrop={removedBackdrop}
      disabledBackdropPress={disabledBackdropPress}
      onBackdropPress={onBackdropPress}
      accessibilityLabelBackdrop={
        accessibilityLabelBackdrop ||
        translations.accessibilityLabelBackdrop[language]
      }
      accessibilityHintBackdrop={
        accessibilityHintBackdrop ||
        translations.accessibilityHintBackdrop[language]
      }
      styles={styles}
      countrySelectStyle={countrySelectStyle}
      minBottomsheetHeight={minBottomsheetHeight}
      maxBottomsheetHeight={maxBottomsheetHeight}
      initialBottomsheetHeight={initialBottomsheetHeight}
      dragHandleIndicatorComponent={dragHandleIndicatorComponent}
      header={HeaderModal}
      {...props}
    >
      {ContentModal}
    </BottomSheetModal>
  );
};
