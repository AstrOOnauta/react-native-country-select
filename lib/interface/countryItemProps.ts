import {ICountry} from './country';
import {IThemeProps} from './theme';
import {ICountrySelectStyle} from './countrySelectStyles';
import {ICountrySelectLanguages} from './countrySelectLanguages';

export interface ICountryItemProps {
  country: ICountry;
  theme?: IThemeProps;
  onSelect: (country: ICountry) => void;
  onClose: () => void;
  language: ICountrySelectLanguages;
  countrySelectStyle?: ICountrySelectStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
