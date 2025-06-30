import {StyleProp, TextStyle, ViewStyle} from 'react-native';

interface IBaseModalStyle {
  backdrop?: StyleProp<ViewStyle>;
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

export interface ICountrySelectStyle {
  popup?: IPopupStyle;
}
