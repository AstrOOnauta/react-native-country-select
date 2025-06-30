<h1 align="center">React Native Country Select</h1>

<p>
  🌍 A lightweight and customizable country picker for React Native with modern UI, flags, search engine, and i18n support. Includes TypeScript types, offline support and no dependencies.
</p>

<br>

<div align="center">
  <a href="https://www.npmjs.com/package/react-native-country-select">
    <img src="https://img.shields.io/npm/v/react-native-country-select.svg?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/react-native-country-select">
    <img src="https://img.shields.io/npm/dt/react-native-country-select.svg?style=flat-square&color=success">
  </a>
  <a href="https://github.com/AstrOOnauta/react-native-country-select">
    <img src="https://img.shields.io/github/stars/AstrOOnauta/react-native-country-select?style=flat-square&color=success"/>
  </a>
  <a href="https://github.com/AstrOOnauta/react-native-country-select/issues">
    <img src="https://img.shields.io/github/issues/AstrOOnauta/react-native-country-select?style=flat-square&color=blue"/>
  </a>
  <a href="https://github.com/AstrOOnauta/react-native-country-select/pulls">
    <img src="https://img.shields.io/github/issues-pr/AstrOOnauta/react-native-country-select?style=flat-square&color=blue"/>
  </a>
  <a href="LICENSE.md">
    <img src="https://img.shields.io/:license-isc-yellow.svg?style=flat-square"/>
  </a>
</div>

<br>

<div align="center">
    <a href="https://www.buymeacoffee.com/astroonauta" target="_blank">
        <img src="https://survivingmexico.files.wordpress.com/2018/07/button-gif.gif" alt="Buy Me A Coffee" style="height: auto !important;width: 60% !important;">
    </a>
</div>

<br>

## Features

- 📱 Cross-platform: works with iOS, Android and Expo;
- 🎨 Lib with custom and modern UI;
- 👨‍💻 Functional and class component support;
- 🈶 32 languages supported;
- ♿ Accessibility.

<br>

## Try it out

- [Demo](https://snack.expo.dev/@astroonauta/react-native-country-select)

<br>

## Installation

```sh
npm install react-native-country-select
# or
yarn add react-native-country-select
```

<br>

## Basic Usage

- Class Component

```jsx
import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import CountrySelect from 'react-native-country-select';

export default class App extends Component {
  countryRef = null;

  constructor(props) {
    super(props);
    this.state = {
      showPicker: false,
      country: null,
    };
  }

  handleCountrySelect = country => {
    this.setState({country});
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={() => this.setState({showPicker: true})}>
          <Text>Select Country</Text>
        </TouchableOpacity>
        <Text>
          Country:{' '}
          {`${this.state.selectedCountry?.name?.common} (${this.state.selectedCountry?.cca2})`}
        </Text>

        <CountrySelect
          visible={this.state.showPicker}
          onClose={() => this.setState({showPicker: false})}
          onSelect={this.handleCountrySelect}
        />
      </View>
    );
  }
}
```

<br>

- Function Component

```jsx
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import CountrySelect from 'react-native-country-select';

export default function App() {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountrySelect = country => {
    setSelectedCountry(country);
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text>Select Country</Text>
      </TouchableOpacity>
      <Text>
        Country: {`${selectedCountry?.name?.common} (${selectedCountry?.cca2})`}
      </Text>

      <CountrySelect
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={handleCountrySelect}
      />
    </View>
  );
}
```

<br>

- Typescript

```tsx
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import CountrySelect, {ICountry} from 'react-native-country-select';

export default function App() {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);

  const handleCountrySelect = (country: ICountry) => {
    setSelectedCountry(country);
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text>Select Country</Text>
      </TouchableOpacity>
      <Text>
        Country: {`${selectedCountry?.name?.common} (${selectedCountry?.cca2})`}
      </Text>

      <CountrySelect
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={handleCountrySelect}
      />
    </View>
  );
}
```

<br>

## CountrySelect Props

| Prop                  | Type                        | Required | Default | Description                                                |
| --------------------- | --------------------------- | -------- | ------- | ---------------------------------------------------------- |
| visible               | boolean                     | Yes      | false   | Controls the visibility of the country picker modal        |
| onClose               | () => void                  | Yes      | -       | Callback function called when the modal is closed          |
| onSelect              | (country: ICountry) => void | Yes      | -       | Callback function called when a country is selected        |
| theme                 | 'light' \| 'dark'           | No       | 'light' | Theme for the country picker                               |
| language              | ICountrySelectLanguages     | No       | 'eng'   | Language for country names (see supported languages below) |
| disabledBackdropPress | boolean                     | No       | false   | Whether to disable backdrop press to close                 |
| removedBackdrop       | boolean                     | No       | false   | Whether to remove the backdrop completely                  |
| onBackdropPress       | () => void                  | No       | -       | Custom callback for backdrop press                         |

<br>

### Supported Languages

The `language` prop supports the following values:

| Code       | Language            |
| ---------- | ------------------- |
| `ara`      | Arabic              |
| `bel`      | Belarusian          |
| `bre`      | Breton              |
| `bul`      | Bulgarian           |
| `ces`      | Czech               |
| `deu`      | German              |
| `ell`      | Greek               |
| `eng`      | English             |
| `est`      | Estonian            |
| `fin`      | Finnish             |
| `fra`      | French              |
| `heb`      | Hebrew              |
| `hrv`      | Croatian            |
| `hun`      | Hungarian           |
| `ita`      | Italian             |
| `jpn`      | Japanese            |
| `kor`      | Korean              |
| `nld`      | Dutch               |
| `per`      | Persian             |
| `pol`      | Polish              |
| `por`      | Portuguese          |
| `ron`      | Romanian            |
| `rus`      | Russian             |
| `slk`      | Slovak              |
| `spa`      | Spanish             |
| `srp`      | Serbian             |
| `swe`      | Swedish             |
| `tur`      | Turkish             |
| `ukr`      | Ukrainian           |
| `urd`      | Urdu                |
| `zho`      | Chinese             |
| `zho-Hans` | Simplified Chinese  |
| `zho-Hant` | Traditional Chinese |

<br>

## Testing

When utilizing this package, you may need to target the CountrySelect component in your automated tests. To facilitate this, we provide a testID props for the CountrySelect component. The testID can be integrated with popular testing libraries such as @testing-library/react-native or Maestro. This enables you to efficiently locate and interact with CountrySelect elements within your tests, ensuring a robust and reliable testing experience.

```js
const countrySelect = getByTestId('countrySelectSearchInput');
const countrySelectList = getByTestId('countrySelectList');
const countrySelectItem = getByTestId('countrySelectItem');
```

<br>

## Accessibility

Ensure your app is inclusive and usable by everyone by leveraging built-in React Native accessibility features. The accessibility props are covered by this package.

<br>

## Contributing

Thank you for considering contributing to **react-native-country-select**!

- Fork or clone this repository

```bash
  $ git clone https://github.com/AstrOOnauta/react-native-country-select.git
```

- Repair, Update and Enjoy 🛠️🚧⚙️

- Create a new PR to this repository

<br>

## Credits

@mledoze for the [countries data](https://github.com/mledoze/countries)

## License

[ISC](LICENSE.md)

<br>

<div align = "center">
	<br>
	  Thanks for stopping by! 😁
	<br>
</div>
