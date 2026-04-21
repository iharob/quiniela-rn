import { TeamItem } from '@app/components/teamItem';
import { useTheme } from '@app/theme/ThemeContext';
import { Team } from '@app/types/game';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
  readonly predicted: Team;
  readonly actual: Team;
  readonly direction?: 'normal' | 'reverse';
}

export const TeamCell: React.FC<Props> = (props: Props): React.ReactElement => {
  const { predicted, actual, direction = 'normal' } = props;
  const matched = predicted.country === actual.country;

  return (
    <View style={styles.teamContainer}>
      <View style={styles.predictedRow}>
        <TeamItem
          team={predicted}
          direction={direction}
          strikethrough={!matched}
        />
      </View>
      <View style={[styles.actualRow]}>
        {!matched && <TeamItem team={actual} direction={direction} />}
      </View>
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
