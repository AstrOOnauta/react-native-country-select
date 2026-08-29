import { ICountrySelectLanguages } from '../interface';
import { getAllCountries } from './countryHelpers';
import { getCountryName } from './getCountryName';
import { normalizeCountryName } from './normalizeCountryName';
import { normalizeLanguage } from './normalizeLanguage';

// Han characters are not an index: Chinese country names start with ~150 distinct
// characters, a wall of buttons nobody can navigate. Past this the rail is dropped
// rather than rendered unusable. Every other supported language lands well below —
// Japanese katakana is the next largest at 51, Korean the smallest at 14.
const MAX_USABLE_LETTERS = 60;

const cache = new Map<string, string[]>();

// Built from the whole dataset rather than the filtered list, so the rail stays put
// while the user searches. A hardcoded A–Z left the filter with nothing to point at in
// every language that does not use the Latin script.
export function getAlphabetForLanguage(
  language: ICountrySelectLanguages
): string[] {
  const key = normalizeLanguage(language);
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }

  const letters = new Set<string>();
  for (const country of getAllCountries()) {
    const name = getCountryName(country, language);
    if (!name) continue;

    const first = normalizeCountryName(name.toLowerCase())[0];
    if (first) {
      letters.add(first.toUpperCase());
    }
  }

  const sorted = [...letters].sort((a, b) => a.localeCompare(b));
  const alphabet = sorted.length > MAX_USABLE_LETTERS ? [] : sorted;

  cache.set(key, alphabet);
  return alphabet;
}
