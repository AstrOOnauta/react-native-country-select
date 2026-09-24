import assert from 'node:assert/strict';
import { test } from '@jest/globals';
import { normalizeLanguage } from '../../lib/utils/normalizeLanguage';
import { t } from '../../lib/utils/getTranslation';
import {
  ICountrySelectLanguages,
} from '../../lib/interface';

import { ISO2_LANGUAGES } from '../helpers';

test('every translation key resolves in every language', () => {
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
