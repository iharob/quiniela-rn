import { TeamItem } from '@app/components/teamItem';
import { Team } from '@app/types/game';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
  readonly predicted: Team;
  readonly actual: Team | null;
  readonly direction?: 'normal' | 'reverse';
}

export const TeamCell: React.FC<Props> = (props: Props): React.ReactElement => {
  const { predicted, actual, direction = 'normal' } = props;
  const matched = actual !== null ? predicted.country === actual.country : true;

  return (
    <View style={styles.teamContainer}>
      <View style={styles.predictedRow}>
        <TeamItem
          team={predicted}
          direction={direction}
          strikethrough={!matched}
        />
      </View>
      {actual !== null && (
        <View style={[styles.actualRow]}>
          {!matched && <TeamItem team={actual} direction={direction} />}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  teamContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  predictedRow: {
    paddingVertical: 2,
  },
  actualRow: {
    paddingVertical: 2,
    borderRadius: 4,
    minHeight: 24,
  },
});
