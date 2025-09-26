/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useMemo, useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  FlatList,
  useWindowDimensions,
  Pressable,
  Animated,
  PanResponder,
  ListRenderItem,
  Modal,
  Keyboard,
  Text,
  TouchableOpacity,
} from 'react-native';

import {CountryItem} from '../CountryItem';
import {AlphabeticFilter} from '../AlphabeticFilter';

import {createStyles} from '../styles';
import parseHeight from '../../utils/parseHeight';
import countries from '../../constants/countries.json';
import {translations} from '../../utils/getTranslation';
import {
  ICountry,
  ICountrySelectProps,
  ICountrySelectLanguages,
  IListItem,
} from '../../interface';

const ITEM_HEIGHT = 56;
const SECTION_HEADER_HEIGHT = 40;

const MIN_HEIGHT_PERCENTAGE = 0.3;
const MAX_HEIGHT_PERCENTAGE = 0.9;
const INITIAL_HEIGHT_PERCENTAGE = 0.5;

const DEFAULT_LANGUAGE: ICountrySelectLanguages = 'eng';

export const CountrySelect: React.FC<ICountrySelectProps> = ({
  visible,
  onClose,
  onSelect,
  modalType = 'bottomSheet',
  theme = 'light',
  isFullScreen = false,
  countrySelectStyle,
  popularCountries = [],
  visibleCountries = [],
  hiddenCountries = [],
  language = DEFAULT_LANGUAGE,
  showSearchInput = true,
  showAlphabetFilter = false,
  searchPlaceholder,
  searchPlaceholderTextColor,
  searchSelectionColor,
  showCloseButton = false,
  minBottomsheetHeight,
  maxBottomsheetHeight,
  initialBottomsheetHeight,
  disabledBackdropPress,
  removedBackdrop,
  onBackdropPress,
  dragHandleIndicatorComponent,
  sectionTitleComponent,
  countryItemComponent,
  closeButtonComponent,
  popularCountriesTitle,
  allCountriesTitle,
  showsVerticalScrollIndicator = false,
  countryNotFoundMessage,
  accessibilityLabelBackdrop,
  accessibilityHintBackdrop,
  accessibilityLabelCloseButton,
  accessibilityHintCloseButton,
  accessibilityLabelSearchInput,
  accessibilityHintSearchInput,
  accessibilityLabelCountriesList,
  accessibilityHintCountriesList,
  accessibilityLabelCountryItem,
  accessibilityHintCountryItem,
  accessibilityLabelAlphabetFilter,
  accessibilityHintAlphabetFilter,
  accessibilityLabelAlphabetLetter,
  accessibilityHintAlphabetLetter,
  ...props
}) => {
  const [modalHeight, setModalHeight] = useState(useWindowDimensions().height);
  const [searchQuery, setSearchQuery] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [bottomSheetSize, setBottomSheetSize] = useState({
    minHeight: MIN_HEIGHT_PERCENTAGE * modalHeight,
    maxHeight: MAX_HEIGHT_PERCENTAGE * modalHeight,
    initialHeight: INITIAL_HEIGHT_PERCENTAGE * modalHeight,
  });

  const flatListRef = useRef<FlatList<IListItem>>(null);
  const sheetHeight = useRef(
    new Animated.Value(bottomSheetSize.initialHeight),
  ).current;
  const lastHeight = useRef(bottomSheetSize.initialHeight);
  const dragStartY = useRef(0);

  const styles = createStyles(theme, modalType, isFullScreen);

  useEffect(() => {
    if (modalType === 'popup') {
      return;
    }

    const DRAG_HANDLE_HEIGHT = 20;
    const availableHeight = modalHeight - DRAG_HANDLE_HEIGHT;

    const parsedMinHeight = parseHeight(minBottomsheetHeight, availableHeight);
    const parsedMaxHeight = parseHeight(maxBottomsheetHeight, availableHeight);
    const parsedInitialHeight = parseHeight(
      initialBottomsheetHeight,
      availableHeight,
    );

    setBottomSheetSize({
      minHeight: parsedMinHeight || MIN_HEIGHT_PERCENTAGE * availableHeight,
      maxHeight: parsedMaxHeight || MAX_HEIGHT_PERCENTAGE * availableHeight,
      initialHeight:
        parsedInitialHeight || INITIAL_HEIGHT_PERCENTAGE * availableHeight,
    });
  }, [
    minBottomsheetHeight,
    maxBottomsheetHeight,
    initialBottomsheetHeight,
    modalHeight,
    modalType,
  ]);

  // Resets to initial height when the modal is opened
  useEffect(() => {
    if (modalType === 'popup') {
      return;
    }

    if (visible) {
      sheetHeight.setValue(bottomSheetSize.initialHeight);
      lastHeight.current = bottomSheetSize.initialHeight;
    }
  }, [visible, bottomSheetSize.initialHeight, modalType]);

  useEffect(() => {
    if (modalType === 'popup') {
      return;
    }

    if (isKeyboardVisible) {
      sheetHeight.setValue(parseHeight(bottomSheetSize.maxHeight, modalHeight));
      lastHeight.current = bottomSheetSize.maxHeight;
    } else {
      sheetHeight.setValue(parseHeight(lastHeight.current, modalHeight));
    }
  }, [isKeyboardVisible, modalType]);

  // Monitors keyboard events
  useEffect(() => {
    if (modalType === 'popup') {
      return;
    }

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, [modalType]);

  const handlePanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => {
          // Only respond to touches on the drag handle
          return true;
        },
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          // Only respond to vertical movements with sufficient distance
          return Math.abs(gestureState.dy) > 5;
        },
        onPanResponderGrant: e => {
          dragStartY.current = e.nativeEvent.pageY;
          sheetHeight.stopAnimation();
        },
        onPanResponderMove: e => {
          const currentY = e.nativeEvent.pageY;
          const dy = currentY - dragStartY.current;
          const proposedHeight = lastHeight.current - dy;

          // Allows free dragging but with smooth limits
          sheetHeight.setValue(proposedHeight);
        },
        onPanResponderRelease: e => {
          const currentY = e.nativeEvent.pageY;
          const dy = currentY - dragStartY.current;
          const currentHeight = lastHeight.current - dy;

          // Close modal if the final height is less than minHeight
          if (currentHeight < bottomSheetSize.minHeight) {
            Animated.timing(sheetHeight, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }).start(onClose);
            return;
          }

          // Snap to nearest limit
          const finalHeight = Math.min(
            Math.max(currentHeight, bottomSheetSize.minHeight),
            bottomSheetSize.maxHeight,
          );

          Animated.spring(sheetHeight, {
            toValue: finalHeight,
            useNativeDriver: false,
            tension: 50,
            friction: 12,
          }).start(() => {
            lastHeight.current = finalHeight;
          });
        },
        onPanResponderTerminate: () => {
          // Reset to last stable height if gesture is terminated
          Animated.spring(sheetHeight, {
            toValue: lastHeight.current,
            useNativeDriver: false,
            tension: 50,
            friction: 12,
          }).start();
        },
      }),
    [bottomSheetSize, sheetHeight, onClose],
  );

  // Obtain the country name in the selected language
  const getCountryNameInLanguage = (country: ICountry): string => {
    return (
      country.translations[language]?.common ||
      country.translations[DEFAULT_LANGUAGE]?.common ||
      country.name.common ||
      ''
    );
  };

  // Normalize country name and remove accents
  const normalizeCountryName = (str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const sortCountriesAlphabetically = (
    countriesList: ICountry[],
  ): ICountry[] => {
    return [...countriesList].sort((a, b) => {
      const nameA = normalizeCountryName(
        getCountryNameInLanguage(a).toLowerCase(),
      );
      const nameB = normalizeCountryName(
        getCountryNameInLanguage(b).toLowerCase(),
      );
      return nameA.localeCompare(nameB);
    });
  };

  const countriesList = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    let countriesData = countries as unknown as ICountry[];

    if (visibleCountries.length > 0 && hiddenCountries.length > 0) {
      countriesData = (countries as unknown as ICountry[]).filter(
        country =>
          visibleCountries.includes(country.cca2) &&
          !hiddenCountries.includes(country.cca2),
      );
    }

    if (visibleCountries.length > 0 && hiddenCountries.length === 0) {
      countriesData = (countries as unknown as ICountry[]).filter(country =>
        visibleCountries.includes(country.cca2),
      );
    }

    if (hiddenCountries.length > 0 && visibleCountries.length === 0) {
      countriesData = (countries as unknown as ICountry[]).filter(
        country => !hiddenCountries.includes(country.cca2),
      );
    }

    if (query.length > 0) {
      const filteredCountries = countriesData.filter(country => {
        const countryName = getCountryNameInLanguage(country);
        const normalizedCountryName = normalizeCountryName(
          countryName.toLowerCase(),
        );
        const normalizedQuery = normalizeCountryName(query);
        const callingCode = country.idd.root.toLowerCase();
        const flag = country.flag.toLowerCase();
        const countryCode = country.cca2.toLowerCase();

        return (
          normalizedCountryName.includes(normalizedQuery) ||
          countryName.toLowerCase().includes(query) ||
          callingCode.includes(query) ||
          flag.includes(query) ||
          countryCode.includes(query)
        );
      });

      return sortCountriesAlphabetically(filteredCountries);
    }

    const popularCountriesData = sortCountriesAlphabetically(
      countriesData.filter(country => popularCountries.includes(country.cca2)),
    );

    const otherCountriesData = sortCountriesAlphabetically(
      countriesData.filter(country => !popularCountries.includes(country.cca2)),
    );

    const result: IListItem[] = [];

    if (popularCountriesData.length > 0) {
      result.push({
        isSection: true as const,
        title:
          translations.popularCountriesTitle[
            language as ICountrySelectLanguages
          ],
      });
      result.push(...popularCountriesData);
      result.push({
        isSection: true as const,
        title:
          translations.allCountriesTitle[language as ICountrySelectLanguages],
      });
    }

    result.push(...otherCountriesData);

    return result;
  }, [
    searchQuery,
    popularCountries,
    language,
    visibleCountries,
    hiddenCountries,
  ]);

  // Precompute item heights and offsets for accurate scrollToIndex, including section headers
  const itemHeights = useMemo(() => {
    return countriesList.map(item =>
      'isSection' in item ? SECTION_HEADER_HEIGHT : ITEM_HEIGHT,
    );
  }, [countriesList]);

  const cumulativeOffsets = useMemo(() => {
    let runningTotal = 0;
    return itemHeights.map(h => {
      const offset = runningTotal;
      runningTotal += h;
      return offset;
    });
  }, [itemHeights]);

  // Compute the index right after the "All Countries" section header (independent of localized/custom title)
  const allCountriesStartIndex = useMemo(() => {
    // Collect indices of section headers
    const sectionIndices: number[] = [];
    for (let i = 0; i < countriesList.length; i++) {
      if ('isSection' in countriesList[i]) {
        sectionIndices.push(i);
      }
    }
    // If there are at least two sections, the second one corresponds to "All Countries"
    if (sectionIndices.length >= 2) {
      return sectionIndices[1] + 1;
    }
    // Otherwise, list has no popular section; start at top
    return 0;
  }, [countriesList]);

  const keyExtractor = useCallback(
    (item: IListItem) => ('isSection' in item ? item.title : item.cca2),
    [],
  );

  const getItemLayout = useCallback(
    (_data: IListItem[] | null | undefined, index: number) => {
      const length = itemHeights[index] ?? ITEM_HEIGHT;
      const offset = cumulativeOffsets[index] ?? index * ITEM_HEIGHT;
      return {length, offset, index};
    },
    [itemHeights, cumulativeOffsets],
  );

  // Alphabet letters from A to Z
  const alphabet = useMemo(
    () => Array.from({length: 26}, (_v, i) => String.fromCharCode(65 + i)),
    [],
  );

  // Build a map of first index for each starting letter
  const letterToIndex = useMemo(() => {
    const map: Record<string, number> = {};
    for (let i = allCountriesStartIndex; i < countriesList.length; i++) {
      const item = countriesList[i];
      if ('isSection' in item) {
        continue;
      }
      const name = getCountryNameInLanguage(item as ICountry);
      const first = (name?.[0] || '').toUpperCase();
      if (first && map[first] === undefined) {
        map[first] = i;
      }
    }
    return map;
  }, [language, allCountriesStartIndex, countriesList]);

  const handlePressLetter = useCallback(
    (letter: string) => {
      const index = letterToIndex[letter];
      if (index !== undefined) {
        flatListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0,
        });
      }
    },
    [letterToIndex],
  );

  const renderCloseButton = () => {
    if (closeButtonComponent) {
      return closeButtonComponent();
    }

    return (
      <TouchableOpacity
        testID="countrySelectCloseButton"
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabelCloseButton ||
          translations.accessibilityLabelCloseButton[language]
        }
        accessibilityHint={
          accessibilityHintCloseButton ||
          translations.accessibilityHintCloseButton[language]
        }
        style={[styles.closeButton, countrySelectStyle?.closeButton]}
        activeOpacity={0.6}
        onPress={onClose}>
        <Text
          style={[styles.closeButtonText, countrySelectStyle?.closeButtonText]}>
          {'\u00D7'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSearchInput = () => {
    return (
      <TextInput
        testID="countrySelectSearchInput"
        accessibilityRole="text"
        accessibilityLabel={
          accessibilityLabelSearchInput ||
          translations.accessibilityLabelSearchInput[language]
        }
        accessibilityHint={
          accessibilityHintSearchInput ||
          translations.accessibilityHintSearchInput[language]
        }
        style={[styles.searchInput, countrySelectStyle?.searchInput]}
        placeholder={
          searchPlaceholder ||
          translations.searchPlaceholder[language as ICountrySelectLanguages]
        }
        placeholderTextColor={
          searchPlaceholderTextColor ||
          (theme === 'dark' ? '#FFFFFF80' : '#00000080')
        }
        selectionColor={searchSelectionColor}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    );
  };

  const renderFlatList = () => {
    if (countriesList.length === 0) {
      return (
        <View
          style={[
            styles.countryNotFoundContainer,
            countrySelectStyle?.countryNotFoundContainer,
          ]}>
          <Text
            style={[
              styles.countryNotFoundMessage,
              countrySelectStyle?.countryNotFoundMessage,
            ]}>
            {countryNotFoundMessage ||
              translations.searchNotFoundMessage[
                language as ICountrySelectLanguages
              ]}
          </Text>
        </View>
      );
    }
    return (
      <FlatList
        ref={flatListRef}
        testID="countrySelectList"
        accessibilityRole="list"
        accessibilityLabel={
          accessibilityLabelCountriesList ||
          translations.accessibilityLabelCountriesList[language]
        }
        accessibilityHint={
          accessibilityHintCountriesList ||
          translations.accessibilityHintCountriesList[language]
        }
        data={countriesList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={showsVerticalScrollIndicator || false}
        style={[styles.list, countrySelectStyle?.list]}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    );
  };

  const renderItem: ListRenderItem<IListItem> = useCallback(
    ({item, index}) => {
      if ('isSection' in item) {
        if (sectionTitleComponent) {
          return sectionTitleComponent(item);
        }
        return (
          <Text
            testID="countrySelectSectionTitle"
            accessibilityRole="header"
            style={[styles.sectionTitle, countrySelectStyle?.sectionTitle]}>
            {popularCountriesTitle && index === 0
              ? popularCountriesTitle
              : allCountriesTitle && index > 0
              ? allCountriesTitle
              : item.title}
          </Text>
        );
      }

      if (countryItemComponent) {
        return countryItemComponent(item as ICountry);
      }

      return (
        <CountryItem
          item={item as ICountry}
          onSelect={onSelect}
          onClose={onClose}
          theme={theme}
          language={language}
          countrySelectStyle={countrySelectStyle}
          accessibilityLabel={
            accessibilityLabelCountryItem ||
            translations.accessibilityLabelCountryItem[language]
          }
          accessibilityHint={
            accessibilityHintCountryItem ||
            translations.accessibilityHintCountryItem[language]
          }
        />
      );
    },
    [
      onSelect,
      onClose,
      styles,
      language,
      countryItemComponent,
      sectionTitleComponent,
    ],
  );

  const onViewableItemsChanged = useRef(
    ({
      viewableItems,
    }: {
      viewableItems: Array<{item: IListItem; index: number | null}>;
    }) => {
      let updated: string | null = null;
      for (const v of viewableItems) {
        const it = v.item;
        const idx = v.index ?? -1;
        if (!('isSection' in it) && idx >= allCountriesStartIndex) {
          const name = getCountryNameInLanguage(it as ICountry);
          if (name) {
            updated = name[0].toUpperCase();
          }
          break;
        }
      }
      setActiveLetter(updated);
    },
  ).current;

  const renderAlphabetFilter = () => {
    return (
      <AlphabeticFilter
        alphabet={alphabet}
        activeLetter={activeLetter}
        letterToIndex={letterToIndex}
        onPressLetter={handlePressLetter}
        theme={theme}
        language={language}
        countrySelectStyle={countrySelectStyle}
        accessibilityLabelAlphabetFilter={accessibilityLabelAlphabetFilter}
        accessibilityHintAlphabetFilter={accessibilityHintAlphabetFilter}
        accessibilityLabelAlphabetLetter={accessibilityLabelAlphabetLetter}
        accessibilityHintAlphabetLetter={accessibilityHintAlphabetLetter}
      />
    );
  };

  if (modalType === 'popup' || isFullScreen) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
        statusBarTranslucent
        {...props}>
        <View
          testID="countrySelectContainer"
          style={[
            styles.container,
            countrySelectStyle?.container,
            isFullScreen && {
              flex: 1,
              width: '100%',
              height: '100%',
            },
          ]}>
          <Pressable
            testID="countrySelectBackdrop"
            accessibilityRole="button"
            accessibilityLabel={
              accessibilityLabelBackdrop ||
              translations.accessibilityLabelBackdrop[language]
            }
            accessibilityHint={
              accessibilityHintBackdrop ||
              translations.accessibilityHintBackdrop[language]
            }
            disabled={disabledBackdropPress || removedBackdrop}
            style={[
              styles.backdrop,
              {alignItems: 'center', justifyContent: 'center'},
              countrySelectStyle?.backdrop,
              removedBackdrop && {backgroundColor: 'transparent'},
            ]}
            onPress={onBackdropPress || onClose}
          />
          <View
            testID="countrySelectContent"
            style={[
              styles.content,
              countrySelectStyle?.content,
              isFullScreen && {
                borderRadius: 0,
                width: '100%',
                height: '100%',
              },
            ]}>
            {(isFullScreen || showSearchInput || showCloseButton) && (
              <View
                style={[
                  styles.searchContainer,
                  countrySelectStyle?.searchContainer,
                ]}>
                {(isFullScreen || showCloseButton) && renderCloseButton()}
                {showSearchInput && renderSearchInput()}
              </View>
            )}
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1}}>{renderFlatList()}</View>
              {showAlphabetFilter && <View>{renderAlphabetFilter()}</View>}
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      {...props}>
      <View
        testID="countrySelectContainer"
        style={[styles.container, countrySelectStyle?.container]}
        onLayout={event => {
          const {height} = event.nativeEvent.layout;
          setModalHeight(height);
        }}>
        <Pressable
          testID="countrySelectBackdrop"
          accessibilityRole="button"
          accessibilityLabel={
            accessibilityLabelBackdrop ||
            translations.accessibilityLabelBackdrop[language]
          }
          accessibilityHint={
            accessibilityHintBackdrop ||
            translations.accessibilityHintBackdrop[language]
          }
          disabled={disabledBackdropPress || removedBackdrop}
          style={[
            styles.backdrop,
            countrySelectStyle?.backdrop,
            removedBackdrop && {backgroundColor: 'transparent'},
          ]}
          onPress={onBackdropPress || onClose}
        />
        <Animated.View
          testID="countrySelectContent"
          style={[
            styles.content,
            countrySelectStyle?.content,
            {
              height: sheetHeight,
              minHeight: bottomSheetSize.minHeight,
              maxHeight: bottomSheetSize.maxHeight,
            },
          ]}>
          <View
            {...handlePanResponder.panHandlers}
            style={[
              styles.dragHandleContainer,
              countrySelectStyle?.dragHandleContainer,
            ]}>
            {dragHandleIndicatorComponent ? (
              dragHandleIndicatorComponent()
            ) : (
              <View
                style={[
                  styles.dragHandleIndicator,
                  countrySelectStyle?.dragHandleIndicator,
                ]}
              />
            )}
          </View>
          {(showSearchInput || showCloseButton) && (
            <View
              style={[
                styles.searchContainer,
                countrySelectStyle?.searchContainer,
              ]}>
              {showCloseButton && renderCloseButton()}
              {showSearchInput && renderSearchInput()}
            </View>
          )}

          <Animated.View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1}}>{renderFlatList()}</View>
            {showAlphabetFilter && <View>{renderAlphabetFilter()}</View>}
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};
