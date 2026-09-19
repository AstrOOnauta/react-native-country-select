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
import {
  getAllCountries,
  getCountryByCca2,
  getCountryByCca3,
  getCountriesByCallingCode,
  getCountriesByName,
  getCountriesByRegion,
  getCountriesBySubregion,
  getCountriesDependents,
  getCountriesIndependents,
} from '../lib/utils/countryHelpers';
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

check('a hidden country never shows up as popular', () => {
  const list = getCountriesList({
    searchQuery: '',
    popularCountries: ['BR', 'US'],
    language: 'eng',
    visibleCountries: [],
    hiddenCountries: ['BR'],
  });

  assert.ok(!list.some((item) => 'cca2' in item && item.cca2 === 'BR'));
  assert.ok(list.some((item) => 'cca2' in item && item.cca2 === 'US'));
});

check('no section headers when no popular country is left to show', () => {
  // An unknown code, or every popular country hidden, would otherwise leave an empty
  // "Popular" section sitting on top of the list.
  for (const [popularCountries, hiddenCountries] of [[['XX'], []], [['BR'], ['BR']]]) {
    const list = getCountriesList({
      searchQuery: '',
      popularCountries,
      language: 'eng',
      visibleCountries: [],
      hiddenCountries,
    });
    assert.ok(!list.some((item) => 'isSection' in item), JSON.stringify(popularCountries));
  }
});

check('search results are a flat list, without popular sections', () => {
  const list = getCountriesList({
    searchQuery: 'bra',
    popularCountries: ['BR'],
    language: 'eng',
    visibleCountries: [],
    hiddenCountries: [],
  });

  assert.ok(list.length > 0);
  assert.ok(!list.some((item) => 'isSection' in item));
});

check('search is trimmed, case-insensitive and follows the language', () => {
  const list = (searchQuery: string, language: ICountrySelectLanguages = 'eng') =>
    (getCountriesList({
      searchQuery,
      popularCountries: [],
      language,
      visibleCountries: [],
      hiddenCountries: [],
    }) as ICountry[]).map((c) => c.cca2);

  assert.deepEqual(list('  brazil  '), ['BR']);
  assert.deepEqual(list('BRAZIL'), ['BR']);
  assert.deepEqual(list('🇧🇷'), ['BR']);
  // The displayed name is what people type.
  assert.deepEqual(list('alemanha', 'por'), ['DE']);
});

// --- public helpers -------------------------------------------------------------------

check('country data has one entry per country code', () => {
  const all = getAllCountries();
  assert.equal(all.length, countries.length);
  assert.equal(new Set(all.map((c) => c.cca2)).size, all.length, 'duplicate cca2');
  assert.equal(new Set(all.map((c) => c.cca3)).size, all.length, 'duplicate cca3');
  for (const country of all) {
    assert.ok(country.name?.common, `${country.cca2} has no name`);
  }
});

check('lookup by cca2 and cca3 finds the country, undefined when unknown', () => {
  assert.equal(getCountryByCca2('BR')?.cca3, 'BRA');
  assert.equal(getCountryByCca3('BRA')?.cca2, 'BR');
  assert.equal(getCountryByCca2('ZZ' as ICountry['cca2']), undefined);
  assert.equal(getCountryByCca3('ZZZ'), undefined);
});

check('a calling code finds every country that shares it', () => {
  // The phone input falls back to this to pick a country for a pasted number.
  const codes = (callingCode: string) =>
    getCountriesByCallingCode(callingCode).map((c) => c.cca2).sort();

  assert.deepEqual(codes('+55'), ['BR']);
  assert.deepEqual(codes('+7'), ['KZ', 'RU']);
  assert.deepEqual(codes('+44'), ['GB', 'GG', 'IM', 'JE']);
  assert.deepEqual(codes('+39'), ['IT', 'VA']);
  for (const cca2 of ['US', 'CA', 'BS', 'PR'] as const) {
    assert.ok(codes('+1').includes(cca2), `+1 misses ${cca2}`);
  }
});

check('calling codes are stored whole, never as a truncated root', () => {
  // The source data once split some codes into a root plus suffixes ("+2" + "90" for
  // Saint Helena), so a lookup by the real code found nothing.
  assert.equal(getCountryByCca2('SH')?.idd.root, '+290');
  assert.equal(getCountryByCca2('EH')?.idd.root, '+212');
  assert.deepEqual(getCountriesByCallingCode('+2'), []);
  assert.deepEqual(getCountriesByCallingCode('+3'), []);

  for (const country of getAllCountries()) {
    if (!country.idd.root) continue; // Antarctica and Heard Island have none.
    assert.match(country.idd.root, /^\+\d+$/, country.cca2);
    assert.ok(
      getCountriesByCallingCode(country.idd.root).includes(country),
      `${country.cca2} not found by its own calling code`
    );
  }
});

check('name search matches the translated and English names', () => {
  const codes = (name: string, language?: ICountrySelectLanguages) =>
    getCountriesByName(name, language).map((c) => c.cca2);

  assert.deepEqual(codes('brazil'), ['BR']);
  assert.deepEqual(codes('BRAZIL'), ['BR']);
  assert.deepEqual(codes('Brasil', 'por'), ['BR']);
  assert.deepEqual(codes('brasil', 'pt'), ['BR']);
  assert.deepEqual(codes('são tomé'), ['ST']);
  assert.deepEqual(codes('日本', 'jpn'), ['JP']);
  assert.equal(codes('').length, countries.length);
});

check('region, subregion and independence filters partition the data', () => {
  const all = getAllCountries();

  assert.equal(
    getCountriesIndependents().length + getCountriesDependents().length,
    all.length
  );
  assert.ok(getCountriesByRegion('Americas').every((c) => c.region === 'Americas'));
  assert.ok(getCountriesByRegion('Americas').some((c) => c.cca2 === 'BR'));
  assert.ok(
    getCountriesBySubregion('South America').every((c) => c.subregion === 'South America')
  );
  assert.deepEqual(getCountriesByRegion('Nowhere'), []);
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

check('parseHeight accepts fractional percentages and ignores unit strings', () => {
  assert.equal(parseHeight('10.5%', 800), 84);
  assert.equal(parseHeight('100%', 800), 800);
  assert.equal(parseHeight('0%', 800), 80);
  // Only "<n>%" strings are understood; anything else means "not set".
  assert.equal(parseHeight('300px', 800), 0);
  assert.equal(parseHeight('300', 800), 0);
});

if (process.exitCode) {
  console.error(`\n${passed} check(s) passed, some failed.`);
} else {
  console.log(`All ${passed} checks passed.`);
}
