import React, { useState } from 'react';
import { Button } from 'react-native';
import { expect, test } from '@jest/globals';
import { render, screen, userEvent } from '@testing-library/react-native';

import CountrySelect from '../lib';

// A parent that keeps the picker mounted and only toggles `visible`.
function MountedPicker() {
  const [visible, setVisible] = useState(true);
  return (
    <>
      <Button title="open" onPress={() => setVisible(true)} />
      <CountrySelect
        visible={visible}
        onSelect={() => {}}
        onClose={() => setVisible(false)}
      />
    </>
  );
}

test('selecting a country clears the search, like every other way of closing', async () => {
  const user = userEvent.setup();
  await render(<MountedPicker />);
  await user.type(screen.getByTestId('countrySelectSearchInput'), 'Uruguay');
  await user.press(await screen.findByTestId('countrySelectItem-UY'));

  await user.press(screen.getByText('open'));

  expect(screen.getByTestId('countrySelectSearchInput')).toHaveDisplayValue('');
  expect(await screen.findByTestId('countrySelectItem-AF')).toBeOnTheScreen();
});
