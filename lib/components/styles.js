import { Platform, StyleSheet } from 'react-native';

export const createStyles = (theme, modalType, isFullScreen) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent:
        modalType === 'popup' || isFullScreen ? 'center' : 'flex-end',
    },
    backdrop: {
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      position: 'absolute',
      bottom: 0,
      left: 0,
      alignItems: 'center',
    },
    content:
      modalType === 'popup' || isFullScreen
        ? {
            width: '90%',
            maxWidth: 600,
            height: '60%',
            backgroundColor: theme === 'dark' ? '#202020' : '#FFFFFF',
            borderRadius: 20,
            paddingVertical: 16,
          }
        : {
            width: '100%',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: theme === 'dark' ? '#202020' : '#FFFFFF',
          },
    dragHandleContainer: {
      width: '100%',
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    dragHandleIndicator: {
      width: 40,
      height: 4,
      backgroundColor: theme === 'dark' ? '#FFFFFF40' : '#00000040',
      borderRadius: 2,
    },
    searchContainer: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      flexDirection: 'row',
    },
    searchInput: {
      flex: 1,
      borderRadius: 8,
      paddingHorizontal: 16,
      minHeight: 44,
      fontSize: 16,
      borderColor: theme === 'dark' ? '#F3F3F3' : '#303030',
      borderWidth: 1,
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
    },
    list: {
      flex: 1,
      padding: 16,
      paddingTop: 0,
    },
    countryItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      marginBottom: 8,
      backgroundColor: theme === 'dark' ? '#404040' : '#F3F3F3',
      borderColor: theme === 'dark' ? '#F3F3F3' : '#303030',
      borderWidth: 1,
      borderRadius: 8,
    },
    countryItemSelected: {
      backgroundColor: 'rgba(33, 150, 243, 0.15)',
      borderColor: '#2196F3',
    },
    flag: {
      flex: 0.1,
      marginRight: 10,
      fontSize: 16,
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
      textAlign: 'center',
      fontFamily:
        Platform.OS === 'web'
          ? typeof navigator !== 'undefined' &&
            navigator?.userAgent?.includes('Win')
            ? 'TwemojiMozilla'
            : 'System'
          : 'System',
    },
    countryInfo: {
      flex: 0.9,
      flexDirection: 'row',
      alignItems: 'center',
    },
    callingCode: {
      flex: 0.2,
      fontSize: 14,
      color: theme === 'dark' ? '#FFFFFF80' : '#00000080',
    },
    callingCodeSelected: {
      color: '#1976D2',
    },
    countryName: {
      flex: 0.8,
      fontSize: 16,
      fontWeight: '500',
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
    },
    countryNameSelected: {
      color: '#1976D2',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      paddingVertical: 8,
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
    },
    closeButton: {
      marginRight: 10,
      paddingHorizontal: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme === 'dark' ? '#303030' : '#F3F3F3',
      borderColor: theme === 'dark' ? '#F3F3F3' : '#303030',
      borderWidth: 1,
      borderRadius: 12,
    },
    closeButtonText: {
      fontSize: 24,
      lineHeight: 28,
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
    },
    countryNotFoundContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    countryNotFoundMessage: {
      fontSize: 16,
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
    },
    alphabetContainer: {
      marginRight: 16,
    },
    alphabetLetter: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginVertical: 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    alphabetLetterActive: {
      backgroundColor: theme === 'dark' ? '#FFFFFF30' : '#00000020',
    },
    alphabetLetterDisabled: {
      opacity: 0.4,
    },
    alphabetLetterText: {
      fontSize: 12,
      color: theme === 'dark' ? '#FFFFFFB3' : '#000000B3',
      fontWeight: '600',
    },
    alphabetLetterTextActive: {
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
    },
    alphabetLetterTextDisabled: {
      color: theme === 'dark' ? '#FFFFFF80' : '#00000080',
    },
  });
