import { ICountry, ICountrySelectLanguages } from '../interface';
import { normalizeLanguage } from './normalizeLanguage';

export function getCountryName(
  country: Pick<ICountry, 'name' | 'translations'>,
  language: ICountrySelectLanguages
): string {
  const translation = country.translations?.[normalizeLanguage(language)];
  return translation?.common ?? country.name?.common ?? '';
}

export function getCountryOfficialName(
  country: Pick<ICountry, 'name' | 'translations'>,
  language: ICountrySelectLanguages
): string {
  const translation = country.translations?.[normalizeLanguage(language)];
  return translation?.official ?? country.name?.official ?? '';
}
