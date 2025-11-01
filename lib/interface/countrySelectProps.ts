import * as React from 'react';
import { ModalProps } from 'react-native';

import { ICountry } from './country';
import { IThemeProps } from './theme';
import { ICountryCca2 } from './countryCca2';
import { ISectionTitle } from './sectionTitle';
import { ICountrySelectStyle } from './countrySelectStyles';
import { ICountrySelectLanguages } from './countrySelectLanguages';

interface ICountrySelectBaseProps extends ModalProps, IThemeProps {
  visible: boolean;
  onClose: () => void;
  modalType?: 'bottomSheet' | 'popup';
  countrySelectStyle?: ICountrySelectStyle;
  isFullScreen?: boolean;
  popularCountries?: string[];
  visibleCountries?: ICountryCca2[];
  hiddenCountries?: ICountryCca2[];
  language?: ICountrySelectLanguages;
  showSearchInput?: boolean;
  showAlphabetFilter?: boolean;
  searchPlaceholder?: string;
  searchPlaceholderTextColor?: string;
  searchSelectionColor?: string;
  showCloseButton?: boolean;
  minBottomsheetHeight?: number | string;
  maxBottomsheetHeight?: number | string;
  initialBottomsheetHeight?: number | string;
  disabledBackdropPress?: boolean;
  removedBackdrop?: boolean;
  onBackdropPress?: () => void;
  dragHandleIndicatorComponent?: () => React.ReactElement;
  countryItemComponent?: (item: ICountry) => React.ReactElement;
  sectionTitleComponent?: (item: ISectionTitle) => React.ReactElement;
  closeButtonComponent?: () => React.ReactElement;
  customFlag?: (
    country: ICountry
  ) => React.ReactElement | null | undefined;
  popularCountriesTitle?: string;
  allCountriesTitle?: string;
  showsVerticalScrollIndicator?: boolean;
  countryNotFoundMessage?: string;
  accessibilityLabelBackdrop?: string;
  accessibilityHintBackdrop?: string;
  accessibilityLabelCloseButton?: string;
  accessibilityHintCloseButton?: string;
  accessibilityLabelSearchInput?: string;
  accessibilityHintSearchInput?: string;
  accessibilityLabelCountriesList?: string;
  accessibilityHintCountriesList?: string;
  accessibilityLabelCountryItem?: string;
  accessibilityHintCountryItem?: string;
  accessibilityLabelAlphabetFilter?: string;
  accessibilityHintAlphabetFilter?: string;
  accessibilityLabelAlphabetLetter?: string;
  accessibilityHintAlphabetLetter?: string;
  allowFontScaling?: boolean;
}

interface ICountrySelectSingleProps extends ICountrySelectBaseProps {
  isMultiSelect?: false;
  onSelect: (country: ICountry) => void;
}

interface ICountrySelectMultiProps extends ICountrySelectBaseProps {
  isMultiSelect: true;
  selectedCountries: ICountry[];
  onSelect: (country: ICountry[]) => void;
}

export type ICountrySelectProps =
  | ICountrySelectSingleProps
  | ICountrySelectMultiProps;
