import {StyleProp, TextStyle, ViewStyle} from 'react-native';

export interface ICountrySelectStyle {
  backdrop?: StyleProp<ViewStyle>;
  container?: StyleProp<ViewStyle>;
  content?: StyleProp<ViewStyle>;
  dragHandleContainer?: StyleProp<ViewStyle>;
  dragHandleIndicator?: StyleProp<ViewStyle>;
  closeButton?: StyleProp<ViewStyle>;
  closeButtonText?: StyleProp<TextStyle>;
  searchContainer?: StyleProp<ViewStyle>;
  searchInput?: StyleProp<TextStyle>;
  sectionTitle?: StyleProp<TextStyle>;
  list?: StyleProp<ViewStyle>;
  countryItem?: StyleProp<ViewStyle>;
  flag?: StyleProp<TextStyle>;
  countryInfo?: StyleProp<ViewStyle>;
  callingCode?: StyleProp<TextStyle>;
  countryName?: StyleProp<TextStyle>;
  countryNotFoundContainer?: StyleProp<ViewStyle>;
  countryNotFoundMessage?: StyleProp<TextStyle>;
  alphabetContainer?: StyleProp<ViewStyle>;
  alphabetLetter?: StyleProp<ViewStyle>;
  alphabetLetterText?: StyleProp<TextStyle>;
  alphabetLetterActive?: StyleProp<ViewStyle>;
  alphabetLetterDisabled?: StyleProp<ViewStyle>;
  alphabetLetterTextActive?: StyleProp<TextStyle>;
  alphabetLetterTextDisabled?: StyleProp<TextStyle>;
}
