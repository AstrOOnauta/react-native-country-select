import assert from 'node:assert/strict';
import { test } from '@jest/globals';
import { getAlphabetForLanguage } from '../../lib/utils/getAlphabetForLanguage';

import { countries, ISO2_LANGUAGES, firstLetterOf } from '../helpers';

test('every country is reachable from the rail in every language that has one', () => {
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

test('non-Latin scripts get a usable rail', () => {
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

test('an index too large to navigate is dropped instead of rendered', () => {
  // Han characters are not an alphabet — Chinese produces ~150 distinct first
  // characters. An empty rail tells AlphabeticFilter to render nothing.
  for (const language of ['zho', 'zho-Hans', 'zho-Hant'] as const) {
    assert.deepEqual(getAlphabetForLanguage(language), [], language);
  }
});

test('the rail is sorted, deduplicated and never absurdly long', () => {
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

test('the rail follows the language, not the Latin script', () => {
  assert.notDeepEqual(
    getAlphabetForLanguage('rus'),
    getAlphabetForLanguage('eng'),
    'Russian and English cannot share a rail'
  );
  assert.ok(getAlphabetForLanguage('eng').includes('B'));
  assert.ok(getAlphabetForLanguage('rus').includes('Б'));
});
