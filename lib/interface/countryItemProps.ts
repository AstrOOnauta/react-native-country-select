import {ICountry} from './country';
import {IThemeProps} from './theme';
import {ICountrySelectStyle} from './countrySelectStyles';
import {ICountrySelectLanguages} from './countrySelectLanguages';

export interface ICountryItemProps {
  country: ICountry;
  theme?: IThemeProps;
  isSelected?: boolean;
  onSelect: (country: ICountry) => void;
  language: ICountrySelectLanguages;
  countrySelectStyle?: ICountrySelectStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
