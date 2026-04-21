import { GameWithResult } from '@app/screens/PredictScreen/screens/GroupsScreen/common';
import { BracketMatch, BracketRound, Team } from '@app/types/game';
import { getWinner } from '@app/utils';

const UNKNOWN_TEAM: Team = { name: 'Desconocido', country: 'NA' };

const bracketMatchToGameWithResult = (match: BracketMatch): GameWithResult => ({
  gameId: match.gameId,
  team1: match.team1 ?? UNKNOWN_TEAM,
  team2: match.team2 ?? UNKNOWN_TEAM,
  team1Score: match.team1Score,
  team2Score: match.team2Score,
  date: match.date,
  winner: match.winner ?? undefined,
});

export const findRound = (
  rounds: readonly BracketRound[],
  round: number,
): BracketRound | undefined =>
  rounds.find((bracketRound: BracketRound): boolean => bracketRound.round === round);

export const pairMatchesByFeeders = (
  currentRound: readonly BracketMatch[],
  nextRound: readonly BracketMatch[],
): ReadonlyArray<[GameWithResult, GameWithResult]> => {
  const byId = new Map<number, BracketMatch>(
    currentRound.map((match: BracketMatch): [number, BracketMatch] => [match.gameId, match]),
  );
  const pairs: Array<[GameWithResult, GameWithResult]> = [];

  for (const next of nextRound) {
    if (next.team1FromGame === undefined || next.team2FromGame === undefined) {
      continue;
    }
    const g1 = byId.get(next.team1FromGame);
    const g2 = byId.get(next.team2FromGame);
    if (!g1 || !g2) {
      continue;
    }
    pairs.push([bracketMatchToGameWithResult(g1), bracketMatchToGameWithResult(g2)]);
  }

  return pairs;
};

export const pairGamesByFeeders = (
  games: readonly GameWithResult[],
  nextRound: readonly BracketMatch[],
): ReadonlyArray<[GameWithResult, GameWithResult]> => {
  const byId = new Map<number, GameWithResult>(
    games.map((game: GameWithResult): [number, GameWithResult] => [game.gameId, game]),
  );
  const pairs: Array<[GameWithResult, GameWithResult]> = [];

  for (const next of nextRound) {
    if (next.team1FromGame === undefined || next.team2FromGame === undefined) {
      continue;
    }
    const g1 = byId.get(next.team1FromGame);
    const g2 = byId.get(next.team2FromGame);
    if (!g1 || !g2) {
      continue;
    }
    pairs.push([g1, g2]);
  }

  return pairs;
};

export const buildNextRoundGames = (
  completedPairs: ReadonlyArray<[GameWithResult, GameWithResult]>,
  nextRoundMatches: readonly BracketMatch[],
): readonly GameWithResult[] => {
  const winnersByGameId = new Map<number, Team>();
  for (const [g1, g2] of completedPairs) {
    winnersByGameId.set(g1.gameId, getWinner(g1));
    winnersByGameId.set(g2.gameId, getWinner(g2));
  }

  return nextRoundMatches.map((match: BracketMatch): GameWithResult => {
    const team1 =
      match.team1FromGame !== undefined ? winnersByGameId.get(match.team1FromGame) : undefined;
    const team2 =
      match.team2FromGame !== undefined ? winnersByGameId.get(match.team2FromGame) : undefined;

    return {
      gameId: match.gameId,
      team1: team1 ?? UNKNOWN_TEAM,
      team2: team2 ?? UNKNOWN_TEAM,
      team1Score: null,
      team2Score: null,
      winner: undefined,
      date: match.date,
    };
  });
};
