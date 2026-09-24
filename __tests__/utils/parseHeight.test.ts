import assert from 'node:assert/strict';
import { test } from '@jest/globals';
import parseHeight from '../../lib/utils/parseHeight';

test('parseHeight handles percentages, pixels and junk', () => {
  assert.equal(parseHeight('50%', 800), 400);
  assert.equal(parseHeight(undefined, 800), 0);
  assert.equal(parseHeight('abc', 800), 0);
  // Clamped to the window and to a 10% floor.
  assert.equal(parseHeight('150%', 800), 800);
  assert.equal(parseHeight(10, 800), 80);
});

test('parseHeight accepts fractional percentages and ignores unit strings', () => {
  assert.equal(parseHeight('10.5%', 800), 84);
  assert.equal(parseHeight('100%', 800), 800);
  assert.equal(parseHeight('0%', 800), 80);
  // Only "<n>%" strings are understood; anything else means "not set".
  assert.equal(parseHeight('300px', 800), 0);
  assert.equal(parseHeight('300', 800), 0);
});
