import { ScoreInput } from '@app/components/scoreInput';
import { TeamItem } from '@app/components/teamItem';
import { useTheme } from '@app/theme/ThemeContext';
import { Team } from '@app/types/game';
import CheckBox from '@react-native-community/checkbox';
import React from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';

interface TintColors {
  readonly true: string;
  readonly false: string;
}

interface Props {
  readonly score: number | null;
  readonly team: Team;
  readonly winner: Team | null;
  readonly tied: boolean;

  onScoreChange(team: Team, value: number | null): void;
  onWinnerSelected(team: Team): void;
}

export const GameTeam: React.FC<Props> = (props: Props): React.ReactElement => {
  const { score, team, tied, winner, onScoreChange, onWinnerSelected } = props;
  const theme = useTheme();

  const checked = React.useMemo((): boolean => team.country === winner?.country, [team, winner]);
  const disabled = React.useMemo((): boolean => !tied, [tied]);

  const handleWinnerSelection = React.useCallback((): void => {
    onWinnerSelected(team);
  }, [onWinnerSelected, team]);

  const colors = React.useMemo(
    (): TintColors => ({ true: theme.primaryColorBright, false: theme.textColor }),
    [theme.primaryColorBright, theme.textColor],
  );

  const checkboxStyle = React.useMemo(
    (): TextStyle | undefined =>
      disabled
        ? {
            opacity: 0.35,
          }
        : undefined,
    [disabled],
  );

  return (
    <View style={styles.container}>
      <CheckBox
        value={checked}
        tintColors={colors}
        style={checkboxStyle}
        boxType="circle"
        lineWidth={4}
        disabled={disabled}
        onChange={handleWinnerSelection}
      />
      <View style={styles.teamContainer}>
        <TeamItem team={team} />
      </View>
      <ScoreInput value={score} team={team} onChange={onScoreChange} />
    </View>
  );
};

GameTeam.displayName = 'GameTeam';

const styles = StyleSheet.create({
  checkbox: {},
  hidden: {
    opacity: 0.25,
  },
  teamContainer: {
    flexShrink: 0,
    flexGrow: 1,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    alignItems: 'center',
  },
});
