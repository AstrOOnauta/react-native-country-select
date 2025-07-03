import {StyleProp, TextStyle, ViewStyle} from 'react-native';

interface IBaseModalStyle {
  backdrop?: StyleProp<ViewStyle>;
  closeButton?: StyleProp<ViewStyle>;
  closeButtonText?: StyleProp<TextStyle>;
  searchContainer?: StyleProp<ViewStyle>;
  searchInput?: StyleProp<TextStyle>;
  searchInputPlaceholder?: {
    color: string;
  };
  sectionTitle?: StyleProp<TextStyle>;
  list?: StyleProp<ViewStyle>;
  countryItem?: StyleProp<ViewStyle>;
  flag?: StyleProp<TextStyle>;
  countryInfo?: StyleProp<ViewStyle>;
  callingCode?: StyleProp<TextStyle>;
  countryName?: StyleProp<TextStyle>;
}

interface IPopupStyle extends IBaseModalStyle {
  popupContainer?: StyleProp<ViewStyle>;
  popupContent?: StyleProp<ViewStyle>;
}

interface IBottomSheetStyle extends IBaseModalStyle {
  sheetContainer?: StyleProp<ViewStyle>;
  sheetContent?: StyleProp<ViewStyle>;
}

export interface ICountrySelectStyle {
  popup?: IPopupStyle;
  bottomSheet?: IBottomSheetStyle;
}
