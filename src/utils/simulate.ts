import { GameWithResult } from '@app/screens/PredictScreen/screens/GroupsScreen/common';
import { Team } from '@app/types/game';

import rankings from '../../rankings.json';

interface FifaRankingEntry {
  readonly rank: number;
  readonly name: string;
  readonly iso2: string;
  readonly points: number;
  readonly confederation: string;
}

const DEFAULT_POINTS = 1300;
const TOTAL_EXPECTED_GOALS = 3.5;

const pointsByCountry: ReadonlyMap<string, number> = new Map(
  (rankings as readonly FifaRankingEntry[]).map(e => [e.iso2, e.points]),
);

const getPoints = (team: Team): number => {
  if (!pointsByCountry.get(team.country)) {
    const value = pointsByCountry.get(`GB-${team.country}`);
    if (value) {
      return value;
    }

    return DEFAULT_POINTS;
  }

  return pointsByCountry.get(team.country) ?? DEFAULT_POINTS;
};

const poissonSample = (lambda: number): number => {
  const limit = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > limit);
  return k - 1;
};

const computeStrengthShare = (pointsA: number, pointsB: number): number =>
  1 / (1 + Math.pow(10, -(pointsA - pointsB) / 250));

export const simulateGroupScore = (
  team1: Team,
  team2: Team,
): { readonly team1Score: number; readonly team2Score: number } => {
  const share = computeStrengthShare(getPoints(team1), getPoints(team2));
  return {
    team1Score: poissonSample(TOTAL_EXPECTED_GOALS * share),
    team2Score: poissonSample(TOTAL_EXPECTED_GOALS * (1 - share)),
  };
};

interface SimulatedScore {
  readonly team1: Team;
  readonly team2: Team;
  readonly team1Score: number;
  readonly team2Score: number;
  readonly winner: Team | null;
}

export const simulateScore = (team1: Team, team2: Team): SimulatedScore => {
  const share = computeStrengthShare(getPoints(team1), getPoints(team2));
  const team1Score = poissonSample(TOTAL_EXPECTED_GOALS * share);
  const team2Score = poissonSample(TOTAL_EXPECTED_GOALS * (1 - share));
  const winner = team1Score === team2Score ? (Math.random() < share ? team1 : team2) : null;

  return {
    team1: team1,
    team2: team2,
    team1Score: team1Score,
    team2Score: team2Score,
    winner: winner,
  };
};

export const simulatePair = ([game1, game2]: [GameWithResult, GameWithResult]): [
  GameWithResult,
  GameWithResult,
] => {
  const sim1 = simulateScore(game1.team1, game1.team2);
  const sim2 = simulateScore(game2.team1, game2.team2);

  return [
    { ...game1, ...sim1 },
    { ...game2, ...sim2 },
  ];
};
