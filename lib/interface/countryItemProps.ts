import {ICountry} from './country';
import {ICountrySelectLanguages} from './countrySelectLanguages';

export interface ICountryItemProps {
  item: ICountry;
  onSelect: (country: ICountry) => void;
  onClose: () => void;
  language: ICountrySelectLanguages;
  theme?: 'light' | 'dark';
}
