import { GameWithResult } from '@app/screens/PredictScreen/screens/GroupsScreen/common';
import { Team } from '@app/types/game';

const unknownTeam: Team = {
  name: 'Desconocido',
  country: 'NA',
};

export const getWinner = (game: GameWithResult): Team => {
  const { team1, team1Score, team2, team2Score } = game;
  if (team1Score === null || team2Score === null) {
    return unknownTeam;
  }

  if (team1Score > team2Score) {
    return team1;
  } else if (team1Score < team2Score) {
    return team2;
  } else {
    return game.winner ?? unknownTeam;
  }
};
