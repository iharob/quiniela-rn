import listStyles from '@app/screens/ParticipantsScreen/screens/UsersList/listStyles';
import { useTheme } from '@app/theme/ThemeContext';
import { faStarHalfStroke, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

export const ListHeader: React.FC = (): React.ReactElement => {
  const theme = useTheme();

  const headerStyle = React.useMemo(
    (): ViewStyle => ({ ...styles.header, backgroundColor: theme.cardColor }),
    [theme.cardColor],
  );

  const headerTextStyle = React.useMemo(
    (): TextStyle => ({ ...styles.headerText, color: theme.contrastTextColor }),
    [theme.contrastTextColor],
  );

  return (
    <View style={headerStyle}>
      <View style={listStyles.currentRankContainer}>
        <FontAwesomeIcon icon={faTrophy} color={theme.contrastTextColor} />
      </View>
      <View style={listStyles.rankUpdateIcon} />
      <View style={styles.avatarSpacer} />
      <Text style={[headerTextStyle, styles.userNameHeader]}>Nombre</Text>
      <View style={styles.scoreHeader}>
        <FontAwesomeIcon
          icon={faStarHalfStroke}
          color={theme.contrastTextColor}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userNameHeader: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  avatarSpacer: {
    width: 46,
  },
  centered: {
    textAlign: 'center',
  },
  scoreHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  headerText: {
    fontSize: 13,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});
