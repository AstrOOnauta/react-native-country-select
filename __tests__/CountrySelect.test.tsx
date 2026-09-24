import React from 'react';
import { Text } from 'react-native';
import { describe, expect, jest, test } from '@jest/globals';
import { act, fireEvent, render, screen, userEvent } from '@testing-library/react-native';

import CountrySelect, { getCountryByCca2 } from '../lib';
import { ICountry, ICountrySelectProps } from '../lib/interface';
import { t } from '../lib/utils/getTranslation';

type SingleProps = Extract<ICountrySelectProps, { isMultiSelect?: false }>;

const searchInput = () => screen.getByTestId('countrySelectSearchInput');
const item = (cca2: string) => screen.findByTestId(`countrySelectItem-${cca2}`);
// The content is `accessibilityViewIsModal`, which hides its siblings from assistive
// tech (and from RNTL's default queries) — the backdrop is a touch target, not a
// screen reader one.
const backdrop = () =>
  screen.getByTestId('countrySelectBackdrop', { includeHiddenElements: true });
const renderedCodes = () =>
  screen
    .queryAllByTestId(/^countrySelectItem-[A-Z]{2}$/)
    .map((element) => String(element.props.testID).slice(-2));

async function renderSingle(props: Partial<SingleProps> = {}) {
  const onSelect = jest.fn<(country: ICountry) => void>();
  const onClose = jest.fn<() => void>();
  await render(
    <CountrySelect visible onSelect={onSelect} onClose={onClose} {...props} />
  );
  return { onSelect, onClose };
}

describe('search', () => {
  test('filters the list by name after the debounce', async () => {
    const user = userEvent.setup();
    await renderSingle();
    // Uruguay is off the first rendered page, so finding it proves the search filtered.
    await user.type(searchInput(), 'Uruguay');
    expect(await item('UY')).toBeOnTheScreen();
    expect(renderedCodes()).toEqual(['UY']);
  });

  test('shows the default not-found message', async () => {
    const user = userEvent.setup();
    await renderSingle();
    await user.type(searchInput(), 'zzzzz');
    expect(await screen.findByText(t('searchNotFoundMessage', 'eng'))).toBeOnTheScreen();
  });

  test('a custom not-found message wins', async () => {
    const user = userEvent.setup();
    await renderSingle({ countryNotFoundMessage: 'Nothing here' });
    await user.type(searchInput(), 'zzzzz');
    expect(await screen.findByText('Nothing here')).toBeOnTheScreen();
  });
});

describe('single select', () => {
  // Selecting clears the search, and the list re-renders its full page in timed
  // batches. Waiting for it keeps those updates inside the test (no act() warning).
  const listIsReset = () => item('AF');

  test('reports the country, closes and clears the search', async () => {
    const user = userEvent.setup();
    const { onSelect, onClose } = await renderSingle();
    await user.type(searchInput(), 'Uruguay');
    await user.press(await item('UY'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ cca2: 'UY' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(await listIsReset()).toBeOnTheScreen();
    expect(searchInput()).toHaveDisplayValue('');
  });

  test('customFlag travels with the selected country', async () => {
    const user = userEvent.setup();
    const flag = <Text>custom</Text>;
    const { onSelect } = await renderSingle({ customFlag: () => flag });
    await user.type(searchInput(), 'Uruguay');
    await user.press(await item('UY'));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ cca2: 'UY', customFlag: flag })
    );
    expect(await listIsReset()).toBeOnTheScreen();
  });
});

describe('multi select', () => {
  async function renderMulti(selectedCountries: ICountry[]) {
    const onSelect = jest.fn<(countries: ICountry[]) => void>();
    const onClose = jest.fn<() => void>();
    await render(
      <CountrySelect
        visible
        isMultiSelect
        selectedCountries={selectedCountries}
        onSelect={onSelect}
        onClose={onClose}
      />
    );
    return { onSelect, onClose };
  }

  test('marks the selected countries', async () => {
    await render(
      <CountrySelect
        visible
        isMultiSelect
        selectedCountries={[getCountryByCca2('BR')!]}
        visibleCountries={['BR', 'UY']}
        onSelect={jest.fn<(countries: ICountry[]) => void>()}
        onClose={jest.fn<() => void>()}
      />
    );
    expect(await item('BR')).toBeSelected();
    expect(await item('UY')).not.toBeSelected();
  });

  test('adds a country without closing', async () => {
    const user = userEvent.setup();
    const brazil = getCountryByCca2('BR')!;
    const { onSelect, onClose } = await renderMulti([brazil]);
    await user.type(searchInput(), 'Uruguay');
    await user.press(await item('UY'));
    expect(onSelect).toHaveBeenCalledWith([
      brazil,
      expect.objectContaining({ cca2: 'UY' }),
    ]);
    expect(onClose).not.toHaveBeenCalled();
  });

  test('removes a country that was already selected', async () => {
    const user = userEvent.setup();
    const brazil = getCountryByCca2('BR')!;
    const uruguay = getCountryByCca2('UY')!;
    const { onSelect } = await renderMulti([brazil, uruguay]);
    await user.type(searchInput(), 'Uruguay');
    await user.press(await item('UY'));
    expect(onSelect).toHaveBeenCalledWith([brazil]);
  });
});

describe('list content', () => {
  test('popular countries come first under their own section', async () => {
    await renderSingle({ popularCountries: ['UY', 'BR'] });
    const titles = screen.getAllByTestId('countrySelectSectionTitle');
    expect(titles[0]).toHaveTextContent(t('popularCountriesTitle', 'eng'));
    expect(titles[1]).toHaveTextContent(t('allCountriesTitle', 'eng'));
    // Popular section is sorted by name, before the full list.
    expect(renderedCodes().slice(0, 2)).toEqual(['BR', 'UY']);
  });

  test('section titles can be customized', async () => {
    await renderSingle({
      popularCountries: ['BR'],
      popularCountriesTitle: 'Top',
      allCountriesTitle: 'Everything',
    });
    const titles = screen.getAllByTestId('countrySelectSectionTitle');
    expect(titles[0]).toHaveTextContent('Top');
    expect(titles[1]).toHaveTextContent('Everything');
  });

  test('visibleCountries restricts the list, hiddenCountries removes from it', async () => {
    await renderSingle({ visibleCountries: ['BR', 'UY', 'AR'], hiddenCountries: ['AR'] });
    expect(renderedCodes().sort()).toEqual(['BR', 'UY']);
  });

  test('countryItemComponent replaces the row content', async () => {
    await renderSingle({
      visibleCountries: ['BR'],
      countryItemComponent: (country) => <Text>{`row-${country.cca2}`}</Text>,
    });
    expect(screen.getByText('row-BR')).toBeOnTheScreen();
  });
});

describe('closing', () => {
  test('the close button closes', async () => {
    const user = userEvent.setup();
    const { onClose } = await renderSingle({ showCloseButton: true });
    await user.press(screen.getByTestId('countrySelectCloseButton'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // Each modal type implements its own backdrop.
  describe.each(['popup', 'bottomSheet'] as const)('%s backdrop', (modalType) => {
    test('pressing it closes', async () => {
      const user = userEvent.setup();
      const { onClose } = await renderSingle({ modalType });
      await user.press(backdrop());
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('disabledBackdropPress keeps it open', async () => {
      const user = userEvent.setup();
      const { onClose } = await renderSingle({ modalType, disabledBackdropPress: true });
      await user.press(backdrop());
      expect(onClose).not.toHaveBeenCalled();
    });

    test('onBackdropPress takes over and receives the close function', async () => {
      const user = userEvent.setup();
      const onBackdropPress = jest.fn<(closeModal: () => void) => void>();
      const { onClose } = await renderSingle({ modalType, onBackdropPress });
      await user.press(backdrop());
      expect(onClose).not.toHaveBeenCalled();

      const closeModal = onBackdropPress.mock.calls[0][0];
      await act(async () => {
        closeModal();
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  test('the Android back button closes and calls onRequestClose', async () => {
    const onRequestClose = jest.fn();
    const { onClose } = await renderSingle({ onRequestClose, testID: 'picker' });
    await fireEvent(screen.getByTestId('picker'), 'requestClose');
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onRequestClose).toHaveBeenCalledTimes(1);
  });
});

describe('alphabet filter', () => {
  test('is hidden by default', async () => {
    await renderSingle();
    expect(screen.queryByTestId('countrySelectAlphabetFilter')).not.toBeOnTheScreen();
  });

  test('shows the letters of the language, not A–Z', async () => {
    await renderSingle({ showAlphabetFilter: true, language: 'rus' });
    expect(screen.getByTestId('countrySelectAlphabetFilter')).toBeOnTheScreen();
    expect(screen.getByText('Б')).toBeOnTheScreen();
    expect(screen.queryByText('B')).not.toBeOnTheScreen();
  });
});

describe('modal types', () => {
  test.each(['popup', 'bottomSheet'] as const)('%s renders the search and the list', async (modalType) => {
    await renderSingle({ modalType });
    expect(searchInput()).toBeOnTheScreen();
    expect(await item('AF')).toBeOnTheScreen();
  });
});

describe('language', () => {
  test('placeholder and labels follow the language, ISO 639-1 included', async () => {
    await renderSingle({ language: 'pt' });
    expect(searchInput()).toHaveProp('placeholder', t('searchPlaceholder', 'por'));
    expect(screen.getByLabelText(t('accessibilityLabelSearchInput', 'por'))).toBeOnTheScreen();
  });
});
