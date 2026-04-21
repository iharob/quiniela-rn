import {
  GameWithResult,
  GroupWithResults,
} from '@app/screens/PredictScreen/screens/GroupsScreen/common';
import { Team } from '@app/types/game';
import { computePoints } from '@app/types/points.ts/points';

export class ClassificationEntry {
  public static zero(team: Team): ClassificationEntry {
    return {
      team: team,
      points: 0,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsReceived: 0,
      goalsScored: 0,
      directMatches: {},
    };
  }
}

export interface ClassificationEntry {
  readonly team: Team;
  readonly points: number;
  readonly played: number;
  readonly won: number;
  readonly drawn: number;
  readonly lost: number;
  readonly goalsReceived: number;
  readonly goalsScored: number;
  readonly directMatches: {
    [key: string]: {
      readonly scored: number;
      readonly received: number;
    };
  };
}

export interface ClassificationGroup {
  readonly name: string;
  readonly entries: ClassificationEntry[];
}

const updateClassification = (
  team1: Team,
  team2: Team,
  team1Score: number | null,
  team2Score: number | null,
  table: Record<string, ClassificationEntry>,
): ClassificationEntry => {
  if (team1Score === null || team2Score === null) {
    // Hasn't been played
    return table[team1.country];
  }

  const oldEntry: ClassificationEntry = table[team1.country];
  const points = team1Score > team2Score ? 3 : team1Score === team2Score ? 1 : 0;
  const won = team1Score > team2Score ? oldEntry.won + 1 : oldEntry.won;
  const drawn = team1Score === team2Score ? oldEntry.drawn + 1 : oldEntry.drawn;
  const lost = team1Score < team2Score ? oldEntry.lost + 1 : oldEntry.lost;

  return {
    points: points,
    team: team1,
    played: oldEntry.played + 1,
    won: won,
    drawn: drawn,
    lost: lost,
    goalsReceived: oldEntry.goalsReceived + team2Score,
    goalsScored: oldEntry.goalsScored + team1Score,
    directMatches: {
      ...oldEntry.directMatches,
      [team2.country]: {
        scored: team1Score,
        received: team2Score,
      },
    },
  };
};

export const computeClassificationTable = (
  groups: readonly GroupWithResults[],
): readonly ClassificationGroup[] =>
  groups.map((group: GroupWithResults): ClassificationGroup => {
    const { games } = group;

    const findTeam =
      (team: Team) =>
      (other: Team): boolean =>
        team.country === other.country;

    const teams = games.reduce((teams: readonly Team[], game: GameWithResult): readonly Team[] => {
      const { team1, team2 } = game;
      if (teams.find(findTeam(team1)) && teams.find(findTeam(team2))) {
        return teams;
      } else if (teams.find(findTeam(team1))) {
        return [...teams, team2];
      } else if (teams.find(findTeam(team2))) {
        return [...teams, team1];
      } else {
        return [...teams, team1, team2];
      }
    }, []);

    const mapped = games.reduce(
      (
        table: Record<string, ClassificationEntry>,
        game: GameWithResult,
      ): Record<string, ClassificationEntry> => {
        const { team1, team2, team1Score, team2Score } = game;

        return {
          ...table,
          [team1.country]: updateClassification(team1, team2, team1Score, team2Score, table),
          [team2.country]: updateClassification(team2, team1, team2Score, team1Score, table),
        };
      },
      teams.reduce(
        (
          table: Record<string, ClassificationEntry>,
          team: Team,
        ): Record<string, ClassificationEntry> => {
          return { ...table, [team.country]: ClassificationEntry.zero(team) };
        },
        {},
      ),
    );

    return {
      name: group.name,
      entries: Object.values(mapped).sort(
        (e1: ClassificationEntry, e2: ClassificationEntry): number => {
          const team2 = e2.team;

          const e1Points = computePoints(e1);
          const e2Points = computePoints(e2);

          const e1Difference = e1.goalsScored - e1.goalsReceived;
          const e2Difference = e2.goalsScored - e2.goalsReceived;
          const direct = e1.directMatches[team2.country] ?? { scored: 0, received: 0 };

          if (e1Points !== e2Points) {
            return e2Points - e1Points;
          } else if (e2Difference != e1Difference) {
            return e2Difference - e1Difference;
          } else if (e2.goalsScored !== e1.goalsScored) {
            return e2.goalsScored - e1.goalsScored;
          } else if (direct.scored > direct.received) {
            return 1;
          } else {
            // FIXME: do more computations but need information about the game between these two
            //        teams
            return 0;
          }
        },
      ),
    };
  });
