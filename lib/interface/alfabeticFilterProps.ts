import {ICountrySelectStyle} from './countrySelectStyles';
import {ICountrySelectLanguages} from './countrySelectLanguages';

export interface AlphabeticFilterProps {
  alphabet: string[];
  activeLetter: string | null;
  letterToIndex: Record<string, number>;
  onPressLetter: (letter: string) => void;
  theme?: 'light' | 'dark';
  language: ICountrySelectLanguages;
  countrySelectStyle?: ICountrySelectStyle;
  accessibilityLabelAlphabetFilter?: string;
  accessibilityHintAlphabetFilter?: string;
  accessibilityLabelAlphabetLetter?: string;
  accessibilityHintAlphabetLetter?: string;
}
