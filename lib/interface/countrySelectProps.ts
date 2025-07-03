import * as React from 'react';
import {ModalProps} from 'react-native';
import {ICountry} from './country';
import {ICountryCca2} from './countryCca2';
import {ICountrySelectLanguages} from './countrySelectLanguages';
import {ICountrySelectStyle} from './countrySelectStyles';
import {ISectionTitle} from './sectionTitle';

export interface ICountrySelectProps extends ModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: ICountry) => void;
  modalType?: 'bottomSheet' | 'popup';
  countrySelectStyle?: ICountrySelectStyle;
  theme?: 'light' | 'dark';
  isFullScreen?: boolean;
  popularCountries?: string[];
  visibleCountries?: ICountryCca2[];
  hiddenCountries?: ICountryCca2[];
  language?: ICountrySelectLanguages;
  showSearchInput?: boolean;
  searchPlaceholder?: string;
  showCloseButton?: boolean;
  minBottomsheetHeight?: number | string;
  maxBottomsheetHeight?: number | string;
  initialBottomsheetHeight?: number | string;
  disabledBackdropPress?: boolean;
  removedBackdrop?: boolean;
  onBackdropPress?: () => void;
  countryItemComponent?: (item: ICountry) => React.ReactElement;
  sectionTitleComponent?: (item: ISectionTitle) => React.ReactElement;
  closeButtonComponent?: () => React.ReactElement;
  popularCountriesTitle?: string;
  allCountriesTitle?: string;
  showsVerticalScrollIndicator?: boolean;
}
