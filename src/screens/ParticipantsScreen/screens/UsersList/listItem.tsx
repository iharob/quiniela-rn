import { Avatar } from '@app/components/Avatar';
import styles from '@app/screens/ParticipantsScreen/screens/UsersList/listStyles';
import { ScoreCell } from '@app/screens/ParticipantsScreen/screens/UsersList/scoreCell';
import { useTheme } from '@app/theme/ThemeContext';
import { RankingsEntry } from '@app/types/rankingsEntry';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons/faArrowDown';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Text, TextStyle, View } from 'react-native';

interface Props {
  readonly item: RankingsEntry;
}

export const ListItem: React.FC<Props> = (props: Props): React.ReactElement => {
  const { item } = props;
  const theme = useTheme();

  const userNameStyle = React.useMemo(
    (): TextStyle => ({ ...styles.userNameText, color: theme.textColor }),
    [theme.textColor],
  );

  const subtitleStyle = React.useMemo(
    (): TextStyle => ({
      ...styles.subtitleText,
      color: theme.placeholderTextColor,
    }),
    [theme.placeholderTextColor],
  );

  return (
    <View key={item.userID} style={styles.listItem}>
      <View style={styles.currentRankContainer}>
        <Text style={styles.rankCell}>
          {item.currentRank === 0 ? '' : item.currentRank}
        </Text>
      </View>
      <View style={styles.rankUpdateIcon}>
        {item.rankDifference > 0 ? (
          <FontAwesomeIcon icon={faArrowUp} color="#00a000" />
        ) : item.rankDifference < 0 ? (
          <FontAwesomeIcon icon={faArrowDown} color="#c00000" />
        ) : null}
      </View>
      <Avatar name={item.userName} uri={item.photoUrl} />
      <View style={styles.nameContainer}>
        <Text style={userNameStyle}>{item.userName}</Text>
        <Text style={subtitleStyle}>{item.bio ?? '—'}</Text>
      </View>
      <ScoreCell
        score={item.totalScore}
        difference={item.totalScoreDifference}
      />
    </View>
  );
};
