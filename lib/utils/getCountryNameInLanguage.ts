import {ICountrySelectLanguages, ICountry} from '../interface';

export const getCountryNameInLanguage = (
  country: ICountry,
  language: ICountrySelectLanguages = 'eng',
): string => {
  return country.translations[language]?.common || country.name.common || '';
};
