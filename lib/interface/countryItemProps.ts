import * as React from 'react';
import { ICountry } from './country';
import { IThemeProps } from './theme';
import { ICountrySelectStyle } from './countrySelectStyles';
import { ICountrySelectLanguages } from './countrySelectLanguages';

export interface ICountryItemProps extends IThemeProps {
  country: ICountry;
  isSelected?: boolean;
  onSelect: (country: ICountry) => void;
  language: ICountrySelectLanguages;
  countrySelectStyle?: ICountrySelectStyle;
  customFlag?: (
    country: ICountry
  ) => React.ReactElement | null | undefined;
  countryItemComponent?: (country: ICountry) => React.ReactElement;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  allowFontScaling?: boolean;
}
