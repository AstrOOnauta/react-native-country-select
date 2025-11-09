/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Modal,
  ModalProps,
  NativeSyntheticEvent,
  Pressable,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { ICountrySelectStyle } from '../../interface';

interface FullscreenModalProps extends ModalProps {
  visible: boolean;
  onRequestClose: (event: NativeSyntheticEvent<any>) => void;
  statusBarTranslucent?: boolean;
  removedBackdrop?: boolean;
  disabledBackdropPress?: boolean;
  onBackdropPress?: () => void;
  accessibilityLabelBackdrop?: string;
  accessibilityHintBackdrop?: string;
  styles: ICountrySelectStyle;
  countrySelectStyle?: ICountrySelectStyle;
  header?: React.ReactNode;
  children: React.ReactNode;
}

export const FullscreenModal: React.FC<FullscreenModalProps> = ({
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
  header,
  children,
  ...props
}) => {
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
        <SafeAreaView style={{ flex: 1 }}>
          <View
            testID="countrySelectContainer"
            style={[
              styles.container,
              countrySelectStyle?.container,
              { flex: 1, width: '100%', height: '100%' },
            ]}
          >
            <Pressable
              testID="countrySelectBackdrop"
              accessibilityRole="button"
              accessibilityLabel={accessibilityLabelBackdrop}
              accessibilityHint={accessibilityHintBackdrop}
              disabled={disabledBackdropPress || removedBackdrop}
              style={[
                styles.backdrop,
                { alignItems: 'center', justifyContent: 'center' },
                countrySelectStyle?.backdrop,
                removedBackdrop && { backgroundColor: 'transparent' },
              ]}
              onPress={onBackdropPress || onRequestClose}
            />
            <View
              testID="countrySelectContent"
              style={[
                styles.content,
                countrySelectStyle?.content,
                { borderRadius: 0, width: '100%', height: '100%' },
              ]}
            >
              {header}
              <View style={{ flex: 1, flexDirection: 'row' }}>
                {children}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};
