import { GameTeam } from '@app/components/gameTeam';
import { GameWithResult } from '@app/screens/PredictScreen/screens/GroupsScreen/common';
import { Team } from '@app/types/game';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
  readonly game: GameWithResult;
  readonly winner: Team | null;

  onWinnerSelected(team: Team): void;
  onChange(team: Team, value: number | null): void;
}

export const Game: React.FC<Props> = (props: Props): React.ReactElement => {
  const { game, winner, onChange, onWinnerSelected } = props;

  const tied = React.useMemo(
    () => game.team1Score === game.team2Score,
    [game.team1Score, game.team2Score],
  );

  return (
    <View style={styles.game}>
      <GameTeam
        score={game.team1Score}
        team={game.team1}
        winner={winner}
        tied={tied}
        onScoreChange={onChange}
        onWinnerSelected={onWinnerSelected}
      />
      <GameTeam
        score={game.team2Score}
        team={game.team2}
        winner={winner}
        tied={tied}
        onScoreChange={onChange}
        onWinnerSelected={onWinnerSelected}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  game: {
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
});
