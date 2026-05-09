import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';

import { StaticModal } from '../StaticModal';
import { CloseButton } from '../CloseButton';
import { SearchInput } from '../SearchInput';
import { BottomSheetModal } from '../BottomSheetModal';

import { createStyles } from '../styles';
import { t } from '../../utils/getTranslation';
import {
  isLanguageLoaded,
  loadLanguage,
} from '../../constants/registry';
import {
  ICountry,
  ICountrySelectProps,
} from '../../interface';

import { CountriesList } from '../CountriesList';

type SingleSelectFn = (country: ICountry) => void;
type MultiSelectFn = (countries: ICountry[]) => void;

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
  searchFocusedBorderColor,
  showCloseButton = false,
  minBottomsheetHeight,
  maxBottomsheetHeight,
  initialBottomsheetHeight,
  disabledBackdropPress,
  removedBackdrop,
  onBackdropPress,
  onRequestClose,
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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isLanguageReady, setIsLanguageReady] = useState(() =>
    isLanguageLoaded(language)
  );

  useEffect(() => {
    if (isLanguageLoaded(language)) {
      setIsLanguageReady(true);
      return;
    }
    setIsLanguageReady(false);
    let cancelled = false;
    loadLanguage(language).then(() => {
      if (!cancelled) setIsLanguageReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [language]);

  useEffect(() => {
    if (searchQuery === '') {
      setDebouncedSearchQuery('');
      return;
    }
    const timeout = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 150);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const styles = useMemo(
    () => createStyles(theme, modalType, isFullScreen),
    [theme, modalType, isFullScreen]
  );

  const selectedCountries =
    isMultiSelect && 'selectedCountries' in props
      ? props.selectedCountries ?? []
      : [];

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

  const handleCloseModal = useCallback(() => {
    setSearchQuery('');
    onClose();
  }, [onClose]);

  const handleSelectCountry = useCallback(
    (country: ICountry) => {
      const countryWithCustomFlag = customFlag
        ? { ...country, customFlag: customFlag(country) }
        : country;

      if (isMultiSelect) {
        const onSelectMulti = onSelect as MultiSelectFn;
        const isSelected = selectedCountryCodes.has(country.cca2);
        const next = isSelected
          ? selectedCountries.filter((c) => c.cca2 !== country.cca2)
          : [...selectedCountries, countryWithCustomFlag];
        onSelectMulti(next);
        return;
      }

      (onSelect as SingleSelectFn)(countryWithCustomFlag);
      onClose();
    },
    [
      isMultiSelect,
      selectedCountryCodes,
      selectedCountries,
      customFlag,
      onSelect,
      onClose,
    ]
  );

  const renderCloseButton = () => {
    if (closeButtonComponent) {
      return (
        <TouchableOpacity onPress={handleCloseModal}>
          {closeButtonComponent()}
        </TouchableOpacity>
      );
    }
    return (
      <CloseButton
        theme={theme}
        language={language}
        onClose={handleCloseModal}
        countrySelectStyle={countrySelectStyle}
        accessibilityLabelCloseButton={accessibilityLabelCloseButton}
        accessibilityHintCloseButton={accessibilityHintCloseButton}
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
        {showSearchInput && (
          <SearchInput
            theme={theme}
            language={language}
            value={searchQuery}
            onChangeText={setSearchQuery}
            countrySelectStyle={countrySelectStyle}
            searchPlaceholder={searchPlaceholder}
            searchPlaceholderTextColor={searchPlaceholderTextColor}
            searchSelectionColor={searchSelectionColor}
            searchFocusedBorderColor={searchFocusedBorderColor}
            accessibilityLabelSearchInput={accessibilityLabelSearchInput}
            accessibilityHintSearchInput={accessibilityHintSearchInput}
            allowFontScaling={allowFontScaling}
          />
        )}
      </View>
    ) : null;

  const ContentModal = (
    <CountriesList
      visible={visible}
      isLanguageReady={isLanguageReady}
      searchQuery={debouncedSearchQuery}
      popularCountries={popularCountries}
      visibleCountries={visibleCountries}
      hiddenCountries={hiddenCountries}
      language={language}
      theme={theme}
      styles={styles}
      countrySelectStyle={countrySelectStyle}
      isMultiSelect={!!isMultiSelect}
      selectedCountryCodes={selectedCountryCodes}
      onSelect={handleSelectCountry}
      customFlag={customFlag}
      countryItemComponent={countryItemComponent}
      sectionTitleComponent={sectionTitleComponent}
      popularCountriesTitle={popularCountriesTitle}
      allCountriesTitle={allCountriesTitle}
      showAlphabetFilter={showAlphabetFilter}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      countryNotFoundMessage={countryNotFoundMessage}
      accessibilityLabelCountriesList={accessibilityLabelCountriesList}
      accessibilityHintCountriesList={accessibilityHintCountriesList}
      accessibilityLabelCountryItem={accessibilityLabelCountryItem}
      accessibilityHintCountryItem={accessibilityHintCountryItem}
      accessibilityLabelAlphabetFilter={accessibilityLabelAlphabetFilter}
      accessibilityHintAlphabetFilter={accessibilityHintAlphabetFilter}
      accessibilityLabelAlphabetLetter={accessibilityLabelAlphabetLetter}
      accessibilityHintAlphabetLetter={accessibilityHintAlphabetLetter}
      allowFontScaling={allowFontScaling}
    />
  );

  const handleRequestClose = useCallback(() => {
    handleCloseModal();
    (onRequestClose as undefined | (() => void))?.();
  }, [handleCloseModal, onRequestClose]);

  const backdropLabel =
    accessibilityLabelBackdrop || t('accessibilityLabelBackdrop', language);
  const backdropHint =
    accessibilityHintBackdrop || t('accessibilityHintBackdrop', language);

  if (modalType === 'popup' || isFullScreen) {
    return (
      <StaticModal
        visible={visible}
        onRequestClose={handleRequestClose}
        statusBarTranslucent
        removedBackdrop={removedBackdrop}
        disabledBackdropPress={disabledBackdropPress}
        onBackdropPress={onBackdropPress}
        accessibilityLabelBackdrop={backdropLabel}
        accessibilityHintBackdrop={backdropHint}
        styles={styles}
        countrySelectStyle={countrySelectStyle}
        isFullScreen={isFullScreen}
        header={HeaderModal}
        {...props}
      >
        {ContentModal}
      </StaticModal>
    );
  }

  return (
    <BottomSheetModal
      visible={visible}
      onRequestClose={handleRequestClose}
      statusBarTranslucent
      removedBackdrop={removedBackdrop}
      disabledBackdropPress={disabledBackdropPress}
      onBackdropPress={onBackdropPress}
      accessibilityLabelBackdrop={backdropLabel}
      accessibilityHintBackdrop={backdropHint}
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
