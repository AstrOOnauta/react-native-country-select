import { ICountrySelectLanguages, ICountry } from '../interface';
import { getCountryName } from './getCountryName';

export const getCountryNameInLanguage = (
  country: ICountry,
  language: ICountrySelectLanguages = 'eng'
): string => {
  return getCountryName(country, language);
};
