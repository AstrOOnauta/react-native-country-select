import React from 'react';
import {
  Modal,
  ModalProps,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { ICountrySelectStyle } from '../../interface';

interface StaticModalProps extends ModalProps {
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
  isFullScreen?: boolean;
  header?: React.ReactNode;
  children: React.ReactNode;
}

const localStyles = StyleSheet.create({
  safeArea: { flex: 1 },
  childrenWrapper: { flex: 1, flexDirection: 'row' },
  centeredBackdrop: { alignItems: 'center', justifyContent: 'center' },
  transparentBackdrop: { backgroundColor: 'transparent' },
  fullSize: { flex: 1, width: '100%', height: '100%' },
  fullScreenContent: { borderRadius: 0, width: '100%', height: '100%' },
});

export const StaticModal: React.FC<StaticModalProps> = ({
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
  isFullScreen,
  header,
  children,
  ...props
}) => {
  const backdropDisabled = disabledBackdropPress || removedBackdrop;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
      statusBarTranslucent={statusBarTranslucent}
      {...props}
    >
      <SafeAreaProvider>
        <SafeAreaView style={localStyles.safeArea}>
          <View
            testID="countrySelectContainer"
            style={[
              styles.container,
              countrySelectStyle?.container,
              isFullScreen && localStyles.fullSize,
            ]}
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
                localStyles.centeredBackdrop,
                countrySelectStyle?.backdrop,
                removedBackdrop && localStyles.transparentBackdrop,
              ]}
              onPress={
                onBackdropPress
                  ? () => onBackdropPress(onRequestClose)
                  : onRequestClose
              }
            />
            <View
              testID="countrySelectContent"
              accessibilityViewIsModal
              style={[
                styles.content,
                countrySelectStyle?.content,
                isFullScreen && localStyles.fullScreenContent,
              ]}
            >
              {header}
              <View style={localStyles.childrenWrapper}>
                {children}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};
