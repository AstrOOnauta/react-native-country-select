/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useMemo, useState, useRef} from 'react';
import {View, FlatList, ListRenderItem, Text} from 'react-native';

import {PopupModal} from '../PopupModal';
import {CountryItem} from '../CountryItem';
import {CloseButton} from '../CloseButton';
import {SearchInput} from '../SearchInput';
import {FullscreenModal} from '../FullscreenModal';
import {BottomSheetModal} from '../BottomSheetModal';
import {AlphabeticFilter} from '../AlphabeticFilter';

import {createStyles} from '../styles';
import {translations} from '../../utils/getTranslation';
import {getCountriesList} from '../../utils/getCountriesList';
import {
  ICountry,
  ICountrySelectProps,
  ICountrySelectLanguages,
  IListItem,
  IThemeProps,
} from '../../interface';

const ITEM_HEIGHT = 56;
const SECTION_HEADER_HEIGHT = 40;

export const CountrySelect: React.FC<ICountrySelectProps> = ({
  visible,
  onClose,
  onSelect,
  modalType = 'bottomSheet',
  theme = 'light',
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
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const flatListRef = useRef<FlatList<IListItem>>(null);

  const styles = createStyles(theme, modalType, isFullScreen);

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

  // Precompute item heights and offsets for accurate scrollToIndex, including section headers
  const itemHeights = useMemo(() => {
    return countriesList.map(item =>
      'isSection' in item ? SECTION_HEADER_HEIGHT : ITEM_HEIGHT,
    );
  }, [countriesList]);

  const cumulativeOffsets = useMemo(() => {
    let runningTotal = 0;
    return itemHeights.map(h => {
      const offset = runningTotal;
      runningTotal += h;
      return offset;
    });
  }, [itemHeights]);

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
    (item: IListItem) => ('isSection' in item ? item.title : item.cca2),
    [],
  );

  const getItemLayout = useCallback(
    (_data: IListItem[] | null | undefined, index: number) => {
      const length = itemHeights[index] ?? ITEM_HEIGHT;
      const offset = cumulativeOffsets[index] ?? index * ITEM_HEIGHT;
      return {length, offset, index};
    },
    [itemHeights, cumulativeOffsets],
  );

  const handlePressLetter = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0,
    });
  }, []);

  const handleCloseModal = () => {
    setSearchQuery('');
    setActiveLetter(null);
    onClose();
  };

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
    />
  );

  const onViewableItemsChanged = useRef(
    ({
      viewableItems,
    }: {
      viewableItems: Array<{item: IListItem; index: number | null}>;
    }) => {
      let updated: string | null = null;
      for (const v of viewableItems) {
        const it = v.item;
        const idx = v.index ?? -1;
        if (!('isSection' in it) && idx >= allCountriesStartIndex) {
          const name = (it as ICountry)?.translations[language]?.common || '';
          if (name) {
            updated = name[0].toUpperCase();
          }
          break;
        }
      }
      setActiveLetter(updated);
    },
  ).current;

  const renderFlatList = () => {
    if (countriesList.length === 0) {
      return (
        <View
          style={[
            styles.countryNotFoundContainer,
            countrySelectStyle?.countryNotFoundContainer,
          ]}>
          <Text
            style={[
              styles.countryNotFoundMessage,
              countrySelectStyle?.countryNotFoundMessage,
            ]}>
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
        getItemLayout={getItemLayout}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={showsVerticalScrollIndicator || false}
        style={[styles.list, countrySelectStyle?.list]}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    );
  };

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
            style={[styles.sectionTitle, countrySelectStyle?.sectionTitle]}>
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
          country={item as ICountry}
          onSelect={onSelect}
          onClose={handleCloseModal}
          theme={theme as IThemeProps}
          language={language}
          countrySelectStyle={countrySelectStyle}
          accessibilityLabel={accessibilityLabelCountryItem}
          accessibilityHint={accessibilityHintCountryItem}
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
        accessibilityLabelAlphabetFilter={accessibilityLabelAlphabetFilter}
        accessibilityHintAlphabetFilter={accessibilityHintAlphabetFilter}
        accessibilityLabelAlphabetLetter={accessibilityLabelAlphabetLetter}
        accessibilityHintAlphabetLetter={accessibilityHintAlphabetLetter}
      />
    );
  };

  const HeaderModal =
    showSearchInput || showCloseButton ? (
      <View
        style={[styles.searchContainer, countrySelectStyle?.searchContainer]}>
        {showCloseButton && renderCloseButton()}
        {showSearchInput && renderSearchInput()}
      </View>
    ) : null;

  const ContentModal = (
    <>
      <View style={{flex: 1}}>{renderFlatList()}</View>
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
          header={HeaderModal}>
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
        header={HeaderModal}>
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
      header={HeaderModal}>
      {ContentModal}
    </BottomSheetModal>
  );
};
