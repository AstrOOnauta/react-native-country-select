// Self-check for the pure logic behind the picker: the alphabet rail, name resolution,
// sorting, translations and the bottom sheet height parsing. Run with `npm test`.
import assert from 'node:assert/strict';

import countriesJson from '../lib/constants/countries.json';
import { getAlphabetForLanguage } from '../lib/utils/getAlphabetForLanguage';
import { getCountryName } from '../lib/utils/getCountryName';
import { getCountriesList } from '../lib/utils/getCountriesList';
import { normalizeCountryName } from '../lib/utils/normalizeCountryName';
import { normalizeLanguage } from '../lib/utils/normalizeLanguage';
import { t } from '../lib/utils/getTranslation';
import parseHeight from '../lib/utils/parseHeight';
import { ICountry, ICountrySelectLanguages } from '../lib/interface';

const countries = countriesJson as unknown as ICountry[];

const ISO2_LANGUAGES: ICountrySelectLanguages[] = [
  'ara', 'bel', 'bre', 'bul', 'ces', 'deu', 'ell', 'eng', 'est', 'fin', 'fra',
  'heb', 'hrv', 'hun', 'ita', 'jpn', 'kor', 'nld', 'per', 'pol', 'por', 'ron',
  'rus', 'slk', 'spa', 'srp', 'swe', 'tur', 'ukr', 'urd', 'zho', 'zho-Hans',
  'zho-Hant',
];

// The rail indexes countries by the first character of the displayed name.
const firstLetterOf = (country: ICountry, language: ICountrySelectLanguages) => {
  const name = getCountryName(country, language);
  if (!name) return '';
  return (normalizeCountryName(name.toLowerCase())[0] ?? '').toUpperCase();
};

let passed = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    passed++;
  } catch (error) {
    console.error(`\n✗ ${name}\n  ${(error as Error).message}`);
    process.exitCode = 1;
  }
}

// --- alphabet rail --------------------------------------------------------------------

check('every country is reachable from the rail in every language that has one', () => {
  // A hardcoded A–Z left non-Latin scripts with a rail of dead letters: Russian,
  // Arabic, Korean, Persian, Ukrainian and Urdu matched nothing at all.
  const unreachable: string[] = [];

  for (const language of ISO2_LANGUAGES) {
    const alphabet = getAlphabetForLanguage(language);
    if (alphabet.length === 0) continue;

    const letters = new Set(alphabet);
    for (const country of countries) {
      const letter = firstLetterOf(country, language);
      if (letter && !letters.has(letter)) {
        unreachable.push(`${language}/${country.cca2}: ${letter}`);
      }
    }
  }

  assert.deepEqual(unreachable.slice(0, 10), []);
});

check('non-Latin scripts get a usable rail', () => {
  const isLatin = (letter: string) => /^[A-Z]$/.test(letter);

  for (const language of ['rus', 'ara', 'kor', 'per', 'ukr', 'urd'] as const) {
    const alphabet = getAlphabetForLanguage(language);
    assert.ok(alphabet.length > 0, `${language} has no rail`);
    assert.ok(
      alphabet.some((letter) => !isLatin(letter)),
      `${language} rail is Latin-only, so it indexes nothing`
    );
  }
});

check('an index too large to navigate is dropped instead of rendered', () => {
  // Han characters are not an alphabet — Chinese produces ~150 distinct first
  // characters. An empty rail tells AlphabeticFilter to render nothing.
  for (const language of ['zho', 'zho-Hans', 'zho-Hant'] as const) {
    assert.deepEqual(getAlphabetForLanguage(language), [], language);
  }
});

check('the rail is sorted, deduplicated and never absurdly long', () => {
  for (const language of ISO2_LANGUAGES) {
    const alphabet = getAlphabetForLanguage(language);
    if (alphabet.length === 0) continue;

    assert.equal(
      new Set(alphabet).size,
      alphabet.length,
      `${language} rail has duplicates`
    );
    assert.deepEqual(
      alphabet,
      [...alphabet].sort((a, b) => a.localeCompare(b)),
      `${language} rail is not sorted`
    );
    assert.ok(alphabet.length <= 60, `${language} rail has ${alphabet.length} entries`);
  }
});

check('the rail follows the language, not the Latin script', () => {
  assert.notDeepEqual(
    getAlphabetForLanguage('rus'),
    getAlphabetForLanguage('eng'),
    'Russian and English cannot share a rail'
  );
  assert.ok(getAlphabetForLanguage('eng').includes('B'));
  assert.ok(getAlphabetForLanguage('rus').includes('Б'));
});

// --- translations ---------------------------------------------------------------------

check('every translation key resolves in every language', () => {
  const missing: string[] = [];
  const keys = ['searchPlaceholder', 'popularCountriesTitle', 'allCountriesTitle',
    'searchNotFoundMessage', 'accessibilityLabelCloseButton',
    'accessibilityLabelSearchInput', 'accessibilityLabelCountriesList',
    'accessibilityLabelCountryItem', 'accessibilityLabelAlphabetFilter',
    'accessibilityLabelAlphabetLetter'] as const;

  for (const key of keys) {
    for (const language of ISO2_LANGUAGES) {
      if (typeof t(key, language) !== 'string') {
        missing.push(`${key}/${language}`);
      }
    }
  }

  assert.deepEqual(missing, []);
});

check('ISO 639-1 codes resolve to the same strings as ISO 639-2', () => {
  for (const [iso1, iso2] of [['pt', 'por'], ['en', 'eng'], ['ru', 'rus'],
    ['zh-Hans', 'zho-Hans']] as const) {
    assert.equal(normalizeLanguage(iso1), iso2);
    assert.equal(t('searchPlaceholder', iso1), t('searchPlaceholder', iso2));
  }
});

check('an unknown or missing language falls back to English', () => {
  // Screen reader labels came back `undefined` for anything outside the map, which a
  // runtime i18n library can easily produce ("pt-BR", a locale with a region).
  for (const language of [undefined, null, '', 'xx', 'pt-BR'] as unknown as
    ICountrySelectLanguages[]) {
    assert.equal(
      t('accessibilityLabelSearchInput', language),
      t('accessibilityLabelSearchInput', 'eng'),
      String(language)
    );
  }
});

// --- list building --------------------------------------------------------------------

check('search matches name, calling code and country code', () => {
  const list = (searchQuery: string) =>
    getCountriesList({
      searchQuery,
      popularCountries: [],
      language: 'eng',
      visibleCountries: [],
      hiddenCountries: [],
    }) as ICountry[];

  assert.ok(list('brazil').some((c) => c.cca2 === 'BR'));
  assert.ok(list('+55').some((c) => c.cca2 === 'BR'));
  assert.ok(list('br').some((c) => c.cca2 === 'BR'));
  // Diacritics are normalized on both sides.
  assert.ok(list('sao tome').some((c) => c.cca2 === 'ST'));
  assert.deepEqual(list('zzzzz'), []);
});

check('visible and hidden country filters apply', () => {
  const build = (visibleCountries: string[], hiddenCountries: string[]) =>
    getCountriesList({
      searchQuery: '',
      popularCountries: [],
      language: 'eng',
      visibleCountries,
      hiddenCountries,
    }) as ICountry[];

  assert.deepEqual(
    build(['BR', 'US'], []).map((c) => c.cca2).sort(),
    ['BR', 'US']
  );
  assert.ok(!build([], ['BR']).some((c) => c.cca2 === 'BR'));
  assert.deepEqual(build(['BR', 'US'], ['BR']).map((c) => c.cca2), ['US']);
});

check('popular countries produce exactly two section headers', () => {
  const list = getCountriesList({
    searchQuery: '',
    popularCountries: ['BR', 'US'],
    language: 'eng',
    visibleCountries: [],
    hiddenCountries: [],
  });

  const sections = list.filter((item) => 'isSection' in item);
  assert.equal(sections.length, 2);
  // FlatList keys sections by title, so the two must differ.
  assert.notEqual((sections[0] as any).title, (sections[1] as any).title);
  assert.ok('isSection' in list[0]);
});

check('the list comes out sorted by the displayed name in every language', () => {
  // The comparator used to recompute the name and its NFD form on both sides of every
  // comparison; the key is now built once. Ordering must not have moved.
  const unsorted: string[] = [];

  for (const language of ISO2_LANGUAGES) {
    const list = getCountriesList({
      searchQuery: '',
      popularCountries: [],
      language,
      visibleCountries: [],
      hiddenCountries: [],
    }) as ICountry[];

    const keys = list.map((country) =>
      normalizeCountryName(getCountryName(country, language).toLowerCase())
    );
    for (let i = 1; i < keys.length; i++) {
      if (keys[i - 1].localeCompare(keys[i]) > 0) {
        unsorted.push(`${language}: ${keys[i - 1]} > ${keys[i]}`);
        break;
      }
    }
  }

  assert.deepEqual(unsorted, []);
});

check('sorting keeps every country exactly once', () => {
  const list = getCountriesList({
    searchQuery: '',
    popularCountries: ['BR', 'US'],
    language: 'por',
    visibleCountries: [],
    hiddenCountries: [],
  });

  const codes = list
    .filter((item): item is ICountry => !('isSection' in item))
    .map((country) => country.cca2);

  assert.equal(codes.length, countries.length);
  assert.equal(new Set(codes).size, countries.length);
});

// --- bottom sheet sizing --------------------------------------------------------------

check('parseHeight handles percentages, pixels and junk', () => {
  assert.equal(parseHeight('50%', 800), 400);
  assert.equal(parseHeight(undefined, 800), 0);
  assert.equal(parseHeight('abc', 800), 0);
  // Clamped to the window and to a 10% floor.
  assert.equal(parseHeight('150%', 800), 800);
  assert.equal(parseHeight(10, 800), 80);
});

if (process.exitCode) {
  console.error(`\n${passed} check(s) passed, some failed.`);
} else {
  console.log(`All ${passed} checks passed.`);
}
