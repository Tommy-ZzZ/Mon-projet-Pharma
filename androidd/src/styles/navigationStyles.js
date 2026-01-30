import { StyleSheet } from 'react-native';

export const navigationStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#f2f2f2',
    paddingBottom: 5,
  },
  tabLabel: {
    fontSize: 12,
    color: 'gray',
  },
  tabLabelActive: {
    color: '#0000FF',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenText: {
    fontSize: 18,
  },
});
