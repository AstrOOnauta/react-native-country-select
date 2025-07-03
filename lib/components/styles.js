import {Platform, StatusBar, StyleSheet} from 'react-native';

export const createStyles = theme =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popupContainer: {
      marginTop: StatusBar.currentHeight,
      width: '90%',
      maxWidth: 600,
      height: '60%',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    popupContent: {
      flex: 1,
      width: '100%',
      backgroundColor: theme === 'dark' ? '#202020' : '#FFFFFF',
      borderRadius: 20,
      alignSelf: 'center',
      padding: 16,
    },
    sheetContainer: {
      marginTop: StatusBar.currentHeight,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      alignItems: 'center',
    },
    sheetContent: {
      width: '100%',
      backgroundColor: theme === 'dark' ? '#202020' : '#FFFFFF',
      padding: 16,
      paddingTop: 0,
    },
    dragHandle: {
      width: '100%',
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#202020' : '#FFFFFF',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginBottom: -1,
    },
    dragIndicator: {
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
    searchInputPlaceholder: {
      color: theme === 'dark' ? '#FFFFFF80' : '#00000080',
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
      fontSize: 16,
      color: theme === 'dark' ? '#FFFFFF' : '#000000',
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
  });
