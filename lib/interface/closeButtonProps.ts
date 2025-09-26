import {ICountrySelectLanguages} from './countrySelectLanguages';
import {ICountrySelectStyle} from './countrySelectStyles';
import {IThemeProps} from './theme';

export interface ICloseButtonProps {
  theme?: IThemeProps;
  language: ICountrySelectLanguages;
  onClose: () => void;
  countrySelectStyle?: ICountrySelectStyle;
  accessibilityLabelCloseButton?: string;
  accessibilityHintCloseButton?: string;
}
