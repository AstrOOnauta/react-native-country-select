import {Platform, StatusBar, StyleSheet} from 'react-native';

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
            marginTop: StatusBar.currentHeight,
            width: '90%',
            maxWidth: 600,
            height: '60%',
            backgroundColor: theme === 'dark' ? '#202020' : '#FFFFFF',
            borderRadius: 20,
            padding: 16,
          }
        : {
            marginTop: StatusBar.currentHeight,
            width: '100%',
            backgroundColor: theme === 'dark' ? '#202020' : '#FFFFFF',
            padding: 16,
            paddingTop: 0,
          },
    dragHandleContainer: {
      width: '100%',
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#202020' : '#FFFFFF',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginBottom: -1,
    },
    dragHandleIndicator: {
      width: 40,
      height: 4,
      backgroundColor: theme === 'dark' ? '#FFFFFF40' : '#00000040',
      borderRadius: 2,
    },
    searchContainer: {
      marginBottom: 16,
      paddingTop: 8,
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
    countryName: {
      flex: 0.8,
      fontSize: 16,
      fontWeight: '500',
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
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
  });
