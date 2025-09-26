import {ICountrySelectLanguages} from './countrySelectLanguages';
import {ICountrySelectStyle} from './countrySelectStyles';
import {IThemeProps} from './theme';

export interface ISearchInputProps {
  theme?: IThemeProps;
  language: ICountrySelectLanguages;
  value: string;
  onChangeText: (text: string) => void;
  countrySelectStyle?: ICountrySelectStyle;
  searchPlaceholder?: string;
  searchPlaceholderTextColor?: string;
  searchSelectionColor?: string;
  accessibilityLabelSearchInput?: string;
  accessibilityHintSearchInput?: string;
}
