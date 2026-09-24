import countriesJson from '../lib/constants/countries.json';
import { getCountryName } from '../lib/utils/getCountryName';
import { normalizeCountryName } from '../lib/utils/normalizeCountryName';
import { ICountry, ICountrySelectLanguages } from '../lib/interface';

export const countries = countriesJson as unknown as ICountry[];

export const ISO2_LANGUAGES: ICountrySelectLanguages[] = [
  'ara', 'bel', 'bre', 'bul', 'ces', 'deu', 'ell', 'eng', 'est', 'fin', 'fra',
  'heb', 'hrv', 'hun', 'ita', 'jpn', 'kor', 'nld', 'per', 'pol', 'por', 'ron',
  'rus', 'slk', 'spa', 'srp', 'swe', 'tur', 'ukr', 'urd', 'zho', 'zho-Hans',
  'zho-Hant',
];

// The rail indexes countries by the first character of the displayed name.
export const firstLetterOf = (
  country: ICountry,
  language: ICountrySelectLanguages
) => {
  const name = getCountryName(country, language);
  if (!name) return '';
  return (normalizeCountryName(name.toLowerCase())[0] ?? '').toUpperCase();
};
