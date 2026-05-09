import { ICountrySelectLanguages } from './countrySelectLanguages';
import { ICountrySelectStyle } from './countrySelectStyles';
import { IThemeProps } from './theme';

export interface ICloseButtonProps extends IThemeProps {
  language: ICountrySelectLanguages;
  onClose: () => void;
  countrySelectStyle?: ICountrySelectStyle;
  accessibilityLabelCloseButton?: string;
  accessibilityHintCloseButton?: string;
  allowFontScaling?: boolean;
}
