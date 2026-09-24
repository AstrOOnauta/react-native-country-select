import assert from 'node:assert/strict';
import { test } from '@jest/globals';
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
} from '../../lib/utils/countryHelpers';
import {
  ICountry,
  ICountrySelectLanguages,
} from '../../lib/interface';

import { countries } from '../helpers';

test('country data has one entry per country code', () => {
  const all = getAllCountries();
  assert.equal(all.length, countries.length);
  assert.equal(new Set(all.map((c) => c.cca2)).size, all.length, 'duplicate cca2');
  assert.equal(new Set(all.map((c) => c.cca3)).size, all.length, 'duplicate cca3');
  for (const country of all) {
    assert.ok(country.name?.common, `${country.cca2} has no name`);
  }
});

test('lookup by cca2 and cca3 finds the country, undefined when unknown', () => {
  assert.equal(getCountryByCca2('BR')?.cca3, 'BRA');
  assert.equal(getCountryByCca3('BRA')?.cca2, 'BR');
  assert.equal(getCountryByCca2('ZZ' as ICountry['cca2']), undefined);
  assert.equal(getCountryByCca3('ZZZ'), undefined);
});

test('a calling code finds every country that shares it', () => {
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

test('calling codes are stored whole, never as a truncated root', () => {
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

test('name search matches the translated and English names', () => {
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

test('name search ignores diacritics, like the modal search', () => {
  const codes = (name: string) => getCountriesByName(name).map((c) => c.cca2);

  assert.deepEqual(codes('sao tome'), ['ST']);
  assert.deepEqual(codes('curacao'), ['CW']);
  assert.deepEqual(codes('reunion'), ['RE']);
  assert.deepEqual(codes('SAO TOME'), ['ST']);
});

test('region, subregion and independence filters partition the data', () => {
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
