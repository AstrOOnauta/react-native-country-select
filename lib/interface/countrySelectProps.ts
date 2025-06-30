import {ModalProps} from 'react-native';

import {ICountry} from './country';
import {ICountryCca2} from './countryCca2';
import {ISectionTitle} from './sectionTitle';
import {ICountrySelectLanguages} from './countrySelectLanguages';

export interface ICountrySelectProps extends ModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: ICountry) => void;
  theme?: 'light' | 'dark';
  popularCountries?: string[];
  visibleCountries?: ICountryCca2[];
  hiddenCountries?: ICountryCca2[];
  language?: ICountrySelectLanguages;
  disabledBackdropPress?: boolean;
  removedBackdrop?: boolean;
  onBackdropPress?: () => void;
  countryItemComponent?: (item: ICountry) => React.ReactElement;
  sectionTitleComponent?: (item: ISectionTitle) => React.ReactElement;
  popularCountriesTitle?: string;
  allCountriesTitle?: string;
  showsVerticalScrollIndicator?: boolean;
}
