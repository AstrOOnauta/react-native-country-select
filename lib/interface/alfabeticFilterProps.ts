import {IThemeProps} from './theme';
import {ICountrySelectStyle} from './countrySelectStyles';
import {ICountrySelectLanguages} from './countrySelectLanguages';
import {IListItem} from './itemList';

export interface AlphabeticFilterProps {
  theme?: IThemeProps;
  activeLetter: string | null;
  onPressLetter: (index: number) => void;
  language: ICountrySelectLanguages;
  countries: IListItem[];
  allCountriesStartIndex: number;
  countrySelectStyle?: ICountrySelectStyle;
  accessibilityLabelAlphabetFilter?: string;
  accessibilityHintAlphabetFilter?: string;
  accessibilityLabelAlphabetLetter?: string;
  accessibilityHintAlphabetLetter?: string;
}
