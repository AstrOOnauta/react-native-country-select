import { getTranslation } from '../constants/registry';
import { ICountry, ICountrySelectLanguages } from '../interface';

export function getCountryName(
  country: Pick<ICountry, 'cca2' | 'name'>,
  language: ICountrySelectLanguages
): string {
  const translation = getTranslation(country.cca2, language);
  return translation?.common ?? country.name?.common ?? '';
}

export function getCountryOfficialName(
  country: Pick<ICountry, 'cca2' | 'name'>,
  language: ICountrySelectLanguages
): string {
  const translation = getTranslation(country.cca2, language);
  return translation?.official ?? country.name?.official ?? '';
}
