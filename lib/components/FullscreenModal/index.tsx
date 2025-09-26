/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Modal, Pressable, View} from 'react-native';

import {ICountrySelectStyle} from '../../interface';

type FullscreenModalProps = {
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
  header?: React.ReactNode;
  children: React.ReactNode;
};

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
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
      statusBarTranslucent={statusBarTranslucent}>
      <View
        testID="countrySelectContainer"
        style={[
          styles.container,
          countrySelectStyle?.container,
          {flex: 1, width: '100%', height: '100%'},
        ]}>
        <Pressable
          testID="countrySelectBackdrop"
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabelBackdrop}
          accessibilityHint={accessibilityHintBackdrop}
          disabled={disabledBackdropPress || removedBackdrop}
          style={[
            styles.backdrop,
            {alignItems: 'center', justifyContent: 'center'},
            countrySelectStyle?.backdrop,
            removedBackdrop && {backgroundColor: 'transparent'},
          ]}
          onPress={onBackdropPress || onRequestClose}
        />
        <View
          testID="countrySelectContent"
          style={[
            styles.content,
            countrySelectStyle?.content,
            {borderRadius: 0, width: '100%', height: '100%'},
          ]}>
          {header}
          <View style={{flex: 1, flexDirection: 'row'}}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};
