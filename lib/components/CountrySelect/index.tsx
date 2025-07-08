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
  searchPlaceholder,
  showCloseButton = false,
  minBottomsheetHeight,
  maxBottomsheetHeight,
  initialBottomsheetHeight,
  disabledBackdropPress,
  removedBackdrop,
  onBackdropPress,
  sectionTitleComponent,
  countryItemComponent,
  closeButtonComponent,
  popularCountriesTitle,
  allCountriesTitle,
  showsVerticalScrollIndicator = false,
  countryNotFoundMessage,
  ...props
}) => {
  const {height: windowHeight} = useWindowDimensions();
  const styles = createStyles(theme, modalType, isFullScreen);

  const [searchQuery, setSearchQuery] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [bottomSheetSize, setBottomSheetSize] = useState({
    minHeight: MIN_HEIGHT_PERCENTAGE * windowHeight,
    maxHeight: MAX_HEIGHT_PERCENTAGE * windowHeight,
    initialHeight: INITIAL_HEIGHT_PERCENTAGE * windowHeight,
  });

  const sheetHeight = useRef(
    new Animated.Value(bottomSheetSize.initialHeight),
  ).current;
  const lastHeight = useRef(bottomSheetSize.initialHeight);
  const dragStartY = useRef(0);

  useEffect(() => {
    if (modalType === 'popup') {
      return;
    }

    const DRAG_HANDLE_HEIGHT = 20;
    const availableHeight = windowHeight - DRAG_HANDLE_HEIGHT;

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
    windowHeight,
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
      sheetHeight.setValue(
        parseHeight(bottomSheetSize.maxHeight, windowHeight),
      );
      lastHeight.current = bottomSheetSize.maxHeight;
    } else {
      sheetHeight.setValue(parseHeight(lastHeight.current, windowHeight));
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

  const getCountries = useMemo(() => {
    const query = searchQuery.toLowerCase();

    if (query.length > 0) {
      let countriesData = countries as unknown as ICountry[];

      if (visibleCountries.length > 0) {
        countriesData = (countries as unknown as ICountry[]).filter(country =>
          visibleCountries.includes(country.cca2),
        );
      }

      if (hiddenCountries.length > 0) {
        countriesData = (countries as unknown as ICountry[]).filter(
          country => !hiddenCountries.includes(country.cca2),
        );
      }

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

    let allCountries = countries as unknown as ICountry[];

    if (visibleCountries.length > 0) {
      allCountries = (countries as unknown as ICountry[]).filter(country =>
        visibleCountries.includes(country.cca2),
      );
    }

    if (hiddenCountries.length > 0) {
      allCountries = (countries as unknown as ICountry[]).filter(
        country => !hiddenCountries.includes(country.cca2),
      );
    }

    const popularCountriesData = sortCountriesAlphabetically(
      allCountries.filter(country => popularCountries.includes(country.cca2)),
    );

    const otherCountriesData = sortCountriesAlphabetically(
      allCountries.filter(country => !popularCountries.includes(country.cca2)),
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

  const keyExtractor = useCallback(
    (item: IListItem) => ('isSection' in item ? item.title : item.cca2),
    [],
  );

  const getItemLayout = useCallback(
    (data: IListItem[] | null | undefined, index: number) => {
      let offset = 0;
      let length = ITEM_HEIGHT;

      if (data) {
        const item = data[index];
        if ('isSection' in item) {
          length = SECTION_HEADER_HEIGHT;
        }
      }

      return {
        length,
        offset: offset + index * ITEM_HEIGHT,
        index,
      };
    },
    [],
  );

  const renderCloseButton = () => {
    if (closeButtonComponent) {
      return closeButtonComponent();
    }

    return (
      <TouchableOpacity
        testID="countrySelectCloseButton"
        accessibilityRole="button"
        accessibilityLabel="Country Select Modal Close Button"
        accessibilityHint="Click to close the Country Select modal"
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
        accessibilityLabel="Country Select Search Input"
        accessibilityHint="Type to search for a country"
        style={[styles.searchInput, countrySelectStyle?.searchInput]}
        placeholder={
          searchPlaceholder ||
          translations.searchPlaceholder[language as ICountrySelectLanguages]
        }
        placeholderTextColor={
          countrySelectStyle?.searchInputPlaceholder?.color ||
          styles.searchInputPlaceholder.color
        }
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    );
  };

  const renderFlatList = () => {
    if (getCountries.length === 0) {
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
        testID="countrySelectList"
        accessibilityRole="list"
        accessibilityLabel="Country Select List"
        accessibilityHint="List of countries"
        data={getCountries}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={showsVerticalScrollIndicator || false}
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

  if (modalType === 'popup' || isFullScreen) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
        statusBarTranslucent
        {...props}>
        <Pressable
          testID="countrySelectBackdrop"
          accessibilityRole="button"
          accessibilityLabel="Country Select Modal Backdrop"
          accessibilityHint="Click to close the Country Select modal"
          disabled={disabledBackdropPress || removedBackdrop}
          style={[
            styles.backdrop,
            {alignItems: 'center', justifyContent: 'center'},
            countrySelectStyle?.backdrop,
            removedBackdrop && {backgroundColor: 'transparent'},
          ]}
          onPress={onBackdropPress || onClose}>
          <Pressable
            style={[
              styles.container,
              countrySelectStyle?.container,
              isFullScreen && {
                flex: 1,
                width: '100%',
                height: '100%',
              },
            ]}>
            <View
              style={[
                styles.content,
                countrySelectStyle?.content,
                isFullScreen && {
                  borderRadius: 0,
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

              {renderFlatList()}
            </View>
          </Pressable>
        </Pressable>
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
        style={[
          styles.backdrop,
          countrySelectStyle?.backdrop,
          removedBackdrop && {backgroundColor: 'transparent'},
        ]}>
        <Pressable
          testID="countrySelectBackdrop"
          accessibilityRole="button"
          accessibilityLabel="Country Select Modal Backdrop"
          accessibilityHint="Click to close the Country Select modal"
          disabled={disabledBackdropPress || removedBackdrop}
          style={{flex: 1}}
          onPress={onBackdropPress || onClose}
        />
        <View
          style={[styles.container, countrySelectStyle?.container]}
          pointerEvents="auto">
          <View {...handlePanResponder.panHandlers} style={styles.dragHandle}>
            <View style={styles.dragIndicator} />
          </View>
          <Animated.View
            style={[
              styles.content,
              countrySelectStyle?.content,
              {
                height: sheetHeight,
                minHeight: bottomSheetSize.minHeight,
                maxHeight: bottomSheetSize.maxHeight,
              },
            ]}>
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

            <Animated.View style={{flex: 1}}>{renderFlatList()}</Animated.View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};
