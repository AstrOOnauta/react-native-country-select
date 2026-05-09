import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  NativeSyntheticEvent,
} from 'react-native';

import { PopupModal } from '../PopupModal';
import { CloseButton } from '../CloseButton';
import { SearchInput } from '../SearchInput';
import { FullscreenModal } from '../FullscreenModal';
import { BottomSheetModal } from '../BottomSheetModal';

import { createStyles } from '../styles';
import { translations } from '../../utils/getTranslation';
import {
  ICountry,
  ICountrySelectProps,
  IThemeProps,
} from '../../interface';

import { CountriesList } from '../CountriesList';

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
        const isSelected = selectedCountryCodes.has(country.cca2);
        if (isSelected) {
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

      (onSelect as (country: ICountry) => void)(countryWithCustomFlag);
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
            theme={theme as IThemeProps}
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
      searchQuery={searchQuery}
      popularCountries={popularCountries}
      visibleCountries={visibleCountries}
      hiddenCountries={hiddenCountries}
      language={language}
      theme={theme as IThemeProps}
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
    if (onRequestClose) {
      onRequestClose({} as NativeSyntheticEvent<any>);
    }
  }, [handleCloseModal, onRequestClose]);

  const backdropLabel =
    accessibilityLabelBackdrop ||
    translations.accessibilityLabelBackdrop[language];
  const backdropHint =
    accessibilityHintBackdrop ||
    translations.accessibilityHintBackdrop[language];

  if (modalType === 'popup' || isFullScreen) {
    if (isFullScreen) {
      return (
        <FullscreenModal
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
        onRequestClose={handleRequestClose}
        statusBarTranslucent
        removedBackdrop={removedBackdrop}
        disabledBackdropPress={disabledBackdropPress}
        onBackdropPress={onBackdropPress}
        accessibilityLabelBackdrop={backdropLabel}
        accessibilityHintBackdrop={backdropHint}
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
