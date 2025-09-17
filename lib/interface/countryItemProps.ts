import {ICountry} from './country';
import {ICountrySelectStyle} from './countrySelectStyles';
import {ICountrySelectLanguages} from './countrySelectLanguages';

export interface ICountryItemProps {
  item: ICountry;
  onSelect: (country: ICountry) => void;
  onClose: () => void;
  language: ICountrySelectLanguages;
  theme?: 'light' | 'dark';
  countrySelectStyle?: ICountrySelectStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
