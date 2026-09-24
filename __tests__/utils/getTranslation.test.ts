import assert from 'node:assert/strict';
import { test } from '@jest/globals';
import { normalizeLanguage } from '../../lib/utils/normalizeLanguage';
import { t, translations } from '../../lib/utils/getTranslation';
import {
  ICountrySelectLanguages,
} from '../../lib/interface';

import { ISO2_LANGUAGES } from '../helpers';

test('every translation key has a non-empty entry in every language', () => {
  // Read the table itself: t() falls back to English, so it can never report a gap.
  const missing: string[] = [];

  for (const [key, byLanguage] of Object.entries(translations)) {
    for (const language of ISO2_LANGUAGES) {
      const entry = (byLanguage as Record<string, string | undefined>)[language];
      if (typeof entry !== 'string' || entry.trim() === '') {
        missing.push(`${key}/${language}`);
      }
    }
  }

  assert.ok(Object.keys(translations).length > 0);
  assert.deepEqual(missing, []);
});

test('ISO 639-1 codes resolve to the same strings as ISO 639-2', () => {
  for (const [iso1, iso2] of [['pt', 'por'], ['en', 'eng'], ['ru', 'rus'],
    ['zh-Hans', 'zho-Hans']] as const) {
    assert.equal(normalizeLanguage(iso1), iso2);
    assert.equal(t('searchPlaceholder', iso1), t('searchPlaceholder', iso2));
  }
});

test('an unknown or missing language falls back to English', () => {
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
