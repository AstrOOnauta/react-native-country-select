import {ModalProps} from 'react-native';
import {ICountry} from './country';
import {ICountrySelectLanguages} from './countrySelectLanguages';

export interface ICountrySelectProps extends ModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: ICountry) => void;
  theme?: 'light' | 'dark';
  language?: ICountrySelectLanguages;
  disabledBackdropPress?: boolean;
  removedBackdrop?: boolean;
  onBackdropPress?: () => void;
}
