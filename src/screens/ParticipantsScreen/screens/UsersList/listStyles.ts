import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  indicator: {
    width: 12,
    height: 12,
  },
  listItem: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentRankContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: 20,
  },
  rankCell: {
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 16,
  },
  rankUpdateIcon: {
    width: 16,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  downloadIcon: {
    alignItems: 'center',
    flexGrow: 0,
    width: 40,
    height: 20,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  downloadIconImage: {
    width: 20,
    height: 20,
  },
  nameContainer: {
    flex: 1,
    marginLeft: 10,
  },
  userNameText: {
    fontWeight: '600',
  },
  subtitleText: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default styles;
