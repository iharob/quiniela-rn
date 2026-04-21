import { ListItemBase } from '@app/screens/ParticipantsScreen/screens/ScoreDetails/ListItemBase';
import { TeamCell } from '@app/screens/ParticipantsScreen/screens/ScoreDetails/teamCell';
import { PredictedResult } from '@app/screens/PredictScreen/screens/GroupsScreen/common';
import { useTheme } from '@app/theme/ThemeContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  readonly item: PredictedResult;
}

const ResultAndPrediction: React.FC<Props> = (
  props: Props,
): React.ReactElement => {
  const { item } = props;

  return (
    <ListItemBase added={item.matchPoints} total={item.total}>
      <View style={styles.container}>
        <View style={styles.matchRow}>
          <TeamCell predicted={item.predictedTeam1} actual={item.actualTeam1} />
          <View style={styles.scoresColumn}>
            <View style={styles.scoreContainer}>
              <Text style={styles.score}>{item.predictedScoreTeam1}</Text>
              <Text style={styles.scoreSeparator}>&mdash;</Text>
              <Text style={styles.score}>{item.predictedScoreTeam2}</Text>
            </View>
            <View style={[styles.scoreContainer, styles.actualRow]}>
              <Text style={[styles.score, styles.actualText]}>
                {item.actualScoreTeam1}
              </Text>
              <Text style={[styles.scoreSeparator, styles.actualText]}>
                &mdash;
              </Text>
              <Text style={[styles.score, styles.actualText]}>
                {item.actualScoreTeam2}
              </Text>
            </View>
          </View>
          <TeamCell
            predicted={item.predictedTeam2}
            actual={item.actualTeam2}
            direction="reverse"
          />
        </View>
      </View>
    </ListItemBase>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  scoresColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  actualRow: {
    borderRadius: 4,
  },
  score: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scoreSeparator: {
    fontSize: 14,
    marginHorizontal: 2,
  },
  actualText: {
    opacity: 0.55,
    fontSize: 12,
  },
});

export default ResultAndPrediction;
