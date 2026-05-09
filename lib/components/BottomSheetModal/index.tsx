import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  ModalProps,
  Pressable,
  StyleSheet,
  View,
  PanResponder,
  Keyboard,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import parseHeight from '../../utils/parseHeight';
import { ICountrySelectStyle } from '../../interface';

interface BottomSheetModalProps extends ModalProps {
  visible: boolean;
  onRequestClose: () => void;
  statusBarTranslucent?: boolean;
  removedBackdrop?: boolean;
  disabledBackdropPress?: boolean;
  onBackdropPress?: (closeModal: () => void) => void;
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
}

const MIN_HEIGHT_PERCENTAGE = 0.3;
const MAX_HEIGHT_PERCENTAGE = 0.9;
const INITIAL_HEIGHT_PERCENTAGE = 0.5;

const localStyles = StyleSheet.create({
  safeArea: { flex: 1 },
  childrenWrapper: { flex: 1, flexDirection: 'row' },
  transparentBackdrop: { backgroundColor: 'transparent' },
});

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
  ...props
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
    const parsedMinHeight = parseHeight(
      minBottomsheetHeight,
      modalHeight
    );
    const parsedMaxHeight = parseHeight(
      maxBottomsheetHeight,
      modalHeight
    );
    const parsedInitialHeight = parseHeight(
      initialBottomsheetHeight,
      modalHeight
    );
    setBottomSheetSize({
      minHeight:
        parsedMinHeight || MIN_HEIGHT_PERCENTAGE * modalHeight,
      maxHeight:
        parsedMaxHeight || MAX_HEIGHT_PERCENTAGE * modalHeight,
      initialHeight:
        parsedInitialHeight ||
        INITIAL_HEIGHT_PERCENTAGE * modalHeight,
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
        onPanResponderGrant: (e) => {
          dragStartYRef.current = e.nativeEvent.pageY;
          sheetHeight.stopAnimation();
        },
        onPanResponderMove: (e) => {
          const currentY = e.nativeEvent.pageY;
          const dy = currentY - dragStartYRef.current;
          const proposedHeight = lastHeightRef.current - dy;
          sheetHeight.setValue(proposedHeight);
        },
        onPanResponderRelease: (e) => {
          const currentY = e.nativeEvent.pageY;
          const dy = currentY - dragStartYRef.current;
          const currentHeight = lastHeightRef.current - dy;
          if (currentHeight < bottomSheetSize.minHeight) {
            Animated.timing(sheetHeight, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }).start(() => onRequestClose());
            return;
          }
          const finalHeight = Math.min(
            Math.max(currentHeight, bottomSheetSize.minHeight),
            bottomSheetSize.maxHeight
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
    [bottomSheetSize, sheetHeight, onRequestClose]
  );

  const backdropDisabled = disabledBackdropPress || removedBackdrop;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onRequestClose}
      statusBarTranslucent={statusBarTranslucent}
      {...props}
    >
      <SafeAreaProvider>
        <SafeAreaView style={localStyles.safeArea}>
          <View
            testID="countrySelectContainer"
            style={[styles.container, countrySelectStyle?.container]}
            onLayout={(e) =>
              setModalHeight(e.nativeEvent.layout.height)
            }
          >
            <Pressable
              testID="countrySelectBackdrop"
              accessibilityRole="button"
              accessibilityLabel={accessibilityLabelBackdrop}
              accessibilityHint={accessibilityHintBackdrop}
              accessibilityElementsHidden={backdropDisabled}
              importantForAccessibility={
                backdropDisabled ? 'no-hide-descendants' : 'yes'
              }
              disabled={backdropDisabled}
              style={[
                styles.backdrop,
                countrySelectStyle?.backdrop,
                removedBackdrop && localStyles.transparentBackdrop,
              ]}
              onPress={
                onBackdropPress
                  ? () => onBackdropPress(onRequestClose)
                  : onRequestClose
              }
            />
            <Animated.View
              testID="countrySelectContent"
              accessibilityViewIsModal
              style={[
                styles.content,
                countrySelectStyle?.content,
                { height: sheetHeight },
              ]}
            >
              <View
                {...panHandlers.panHandlers}
                style={[
                  styles.dragHandleContainer,
                  countrySelectStyle?.dragHandleContainer,
                ]}
              >
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
              <View style={localStyles.childrenWrapper}>
                {children}
              </View>
            </Animated.View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};
