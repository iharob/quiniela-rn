import { Avatar } from '@app/components/Avatar';
import { useThemedStyles } from '@app/theme/useThemedStyles';
import { TournamentTheme } from '@app/types/tournamentConfig';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/core';
import { RouteProp } from '@react-navigation/native';
import { StackParamsList } from '@app/screens/ParticipantsScreen';

export const HeaderTitle: React.FC = (): React.ReactElement => {
  const themedStyles = useThemedStyles(themedStylesFactory);
  const route = useRoute<RouteProp<StackParamsList, 'UserScoreDetails'>>();

  const { userName, photoUrl, bio } = route.params;

  return (
    <View style={styles.container}>
      <Avatar name={userName} uri={photoUrl} size={36} />
      <View style={styles.textContainer}>
        <Text style={themedStyles.title} numberOfLines={1}>
          {userName}
        </Text>
        <Text style={themedStyles.bio} numberOfLines={1}>
          {bio ?? <Text>&mdash;</Text>}
        </Text>
      </View>
    </View>
  );
};

const themedStylesFactory = (theme: TournamentTheme) =>
  StyleSheet.create({
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.contrastTextColor,
    },
    bio: {
      fontSize: 12,
      opacity: 0.75,
      color: theme.contrastTextColor,
    },
  });

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 8,
    flexShrink: 1,
  },
});
