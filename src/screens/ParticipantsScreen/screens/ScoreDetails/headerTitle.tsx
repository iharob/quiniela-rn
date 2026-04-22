import { Avatar } from '@app/components/Avatar';
import { useTheme } from '@app/theme/ThemeContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/core';
import { RouteProp } from '@react-navigation/native';
import { HeaderTitleProps } from '@react-navigation/elements';
import { StackParamsList } from '@app/screens/ParticipantsScreen';

export const HeaderTitle: React.FC<HeaderTitleProps> = (
  _props: HeaderTitleProps,
): React.ReactElement => {
  const theme = useTheme();
  const route = useRoute<RouteProp<StackParamsList, 'UserScoreDetails'>>();

  const { userName, photoUrl, bio } = route.params;

  return (
    <View style={styles.container}>
      <Avatar name={userName} uri={photoUrl} size={36} />
      <View style={styles.textContainer}>
        <Text
          style={[styles.title, { color: theme.contrastTextColor }]}
          numberOfLines={1}
        >
          {userName}
        </Text>
        <Text
          style={[styles.bio, { color: theme.contrastTextColor }]}
          numberOfLines={1}
        >
          {bio ?? <Text>&mdash;</Text>}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 8,
    flexShrink: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  bio: {
    fontSize: 12,
    opacity: 0.75,
  },
});
