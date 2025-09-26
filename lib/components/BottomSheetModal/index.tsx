/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Modal,
  Pressable,
  View,
  PanResponder,
  Keyboard,
} from 'react-native';

import parseHeight from '../../utils/parseHeight';
import {ICountrySelectStyle} from '../../interface';

type BottomSheetModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  statusBarTranslucent?: boolean;
  removedBackdrop?: boolean;
  disabledBackdropPress?: boolean;
  onBackdropPress?: () => void;
  accessibilityLabelBackdrop?: string;
  accessibilityHintBackdrop?: string;
  styles: ICountrySelectStyle;
  countrySelectStyle?: ICountrySelectStyle;
  minBottomsheetHeight?: number | string;
  maxBottomsheetHeight?: number | string;
  initialBottomsheetHeight?: number | string;
  dragHandleIndicatorComponent?: () => React.ReactElement;
  header?: React.ReactNode;
  children: React.ReactNode;
};

const MIN_HEIGHT_PERCENTAGE = 0.3;
const MAX_HEIGHT_PERCENTAGE = 0.9;
const INITIAL_HEIGHT_PERCENTAGE = 0.5;

export const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  visible,
  onRequestClose,
  statusBarTranslucent,
  removedBackdrop,
  disabledBackdropPress,
  onBackdropPress,
  accessibilityLabelBackdrop,
  accessibilityHintBackdrop,
  styles,
  countrySelectStyle,
  minBottomsheetHeight,
  maxBottomsheetHeight,
  initialBottomsheetHeight,
  dragHandleIndicatorComponent,
  header,
  children,
}) => {
  const [modalHeight, setModalHeight] = useState(0);
  const [bottomSheetSize, setBottomSheetSize] = useState({
    minHeight: 0,
    maxHeight: 0,
    initialHeight: 0,
  });
  const sheetHeight = useRef(new Animated.Value(0)).current;
  const lastHeightRef = useRef(0);
  const dragStartYRef = useRef(0);

  useEffect(() => {
    const DRAG_HANDLE_HEIGHT = 20;
    const availableHeight = Math.max(0, modalHeight - DRAG_HANDLE_HEIGHT);
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
    modalHeight,
    minBottomsheetHeight,
    maxBottomsheetHeight,
    initialBottomsheetHeight,
  ]);

  useEffect(() => {
    if (visible) {
      sheetHeight.setValue(bottomSheetSize.initialHeight);
      lastHeightRef.current = bottomSheetSize.initialHeight;
    }
  }, [visible, bottomSheetSize.initialHeight, sheetHeight]);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => {
      sheetHeight.setValue(bottomSheetSize.maxHeight);
      lastHeightRef.current = bottomSheetSize.maxHeight;
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      sheetHeight.setValue(lastHeightRef.current);
    });
    return () => {
      show?.remove();
      hide?.remove();
    };
  }, [bottomSheetSize.maxHeight, sheetHeight]);

  const panHandlers = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_evt, gestureState) =>
          Math.abs(gestureState.dy) > 5,
        onPanResponderGrant: e => {
          dragStartYRef.current = e.nativeEvent.pageY;
          sheetHeight.stopAnimation();
        },
        onPanResponderMove: e => {
          const currentY = e.nativeEvent.pageY;
          const dy = currentY - dragStartYRef.current;
          const proposedHeight = lastHeightRef.current - dy;
          sheetHeight.setValue(proposedHeight);
        },
        onPanResponderRelease: e => {
          const currentY = e.nativeEvent.pageY;
          const dy = currentY - dragStartYRef.current;
          const currentHeight = lastHeightRef.current - dy;
          if (currentHeight < bottomSheetSize.minHeight) {
            Animated.timing(sheetHeight, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }).start(onRequestClose);
            return;
          }
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
            lastHeightRef.current = finalHeight;
          });
        },
        onPanResponderTerminate: () => {
          Animated.spring(sheetHeight, {
            toValue: lastHeightRef.current,
            useNativeDriver: false,
            tension: 50,
            friction: 12,
          }).start();
        },
      }),
    [
      bottomSheetSize.minHeight,
      bottomSheetSize.maxHeight,
      sheetHeight,
      onRequestClose,
    ],
  );
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onRequestClose}
      statusBarTranslucent={statusBarTranslucent}>
      <View
        testID="countrySelectContainer"
        style={[styles.container, countrySelectStyle?.container]}
        onLayout={e => setModalHeight(e.nativeEvent.layout.height)}>
        <Pressable
          testID="countrySelectBackdrop"
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabelBackdrop}
          accessibilityHint={accessibilityHintBackdrop}
          disabled={disabledBackdropPress || removedBackdrop}
          style={[
            styles.backdrop,
            countrySelectStyle?.backdrop,
            removedBackdrop && {backgroundColor: 'transparent'},
          ]}
          onPress={onBackdropPress || onRequestClose}
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
            {...panHandlers.panHandlers}
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
          {header}
          <Animated.View style={{flex: 1, flexDirection: 'row'}}>
            {children}
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};
