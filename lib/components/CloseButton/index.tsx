import React, { useMemo } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { createStyles } from '../styles';
import { ICloseButtonProps } from '../../interface';
import { t } from '../../utils/getTranslation';

export const CloseButton: React.FC<ICloseButtonProps> = ({
  theme = 'light',
  language,
  onClose,
  countrySelectStyle,
  accessibilityLabelCloseButton,
  accessibilityHintCloseButton,
  allowFontScaling = true,
}) => {
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <TouchableOpacity
      testID="countrySelectCloseButton"
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabelCloseButton ||
        t('accessibilityLabelCloseButton', language)
      }
      accessibilityHint={
        accessibilityHintCloseButton ||
        t('accessibilityHintCloseButton', language)
      }
      style={[styles.closeButton, countrySelectStyle?.closeButton]}
      activeOpacity={0.6}
      onPress={onClose}
    >
      <Text
        style={[styles.closeButtonText, countrySelectStyle?.closeButtonText]}
        allowFontScaling={allowFontScaling}
      >
        {'\u00D7'}
      </Text>
    </TouchableOpacity>
  );
};
