import assert from 'node:assert/strict';
import { test } from '@jest/globals';
import { getCountryName } from '../../lib/utils/getCountryName';
import { getCountriesList } from '../../lib/utils/getCountriesList';
import { normalizeCountryName } from '../../lib/utils/normalizeCountryName';
import {
  ICountry,
  ICountrySelectLanguages,
} from '../../lib/interface';

import { countries, ISO2_LANGUAGES } from '../helpers';

test('search matches name, calling code and country code', () => {
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

test('visible and hidden country filters apply', () => {
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

test('popular countries produce exactly two section headers', () => {
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

test('the list comes out sorted by the displayed name in every language', () => {
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

test('sorting keeps every country exactly once', () => {
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

test('a hidden country never shows up as popular', () => {
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

test('no section headers when no popular country is left to show', () => {
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

test('search results are a flat list, without popular sections', () => {
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

test('search is trimmed, case-insensitive and follows the language', () => {
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
