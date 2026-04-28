import { queryClient } from '@app/queryClient';
import type { GameResultGroup, LiveScore } from '@app/types/userResults';

interface ScoreMessage {
  readonly data?: { readonly [key: string]: string | object } | undefined;
}

const asString = (value: string | object | undefined): string | undefined =>
  typeof value === 'string' ? value : undefined;

export const handleScoreMessage = (msg: ScoreMessage): void => {
  const data = msg.data;
  if (data === undefined) {
    return;
  }
  const team1 = asString(data.team1);
  const team2 = asString(data.team2);
  const rawTeam1Score = asString(data.team1Score);
  const rawTeam2Score = asString(data.team2Score);
  if (
    team1 === undefined ||
    team2 === undefined ||
    rawTeam1Score === undefined ||
    rawTeam2Score === undefined
  ) {
    return;
  }

  const team1Score = Number(rawTeam1Score);
  const team2Score = Number(rawTeam2Score);
  if (Number.isNaN(team1Score) || Number.isNaN(team2Score)) {
    return;
  }

  const liveScore: LiveScore = {
    team1Score,
    team2Score,
    status: asString(data.status) ?? '',
  };

  queryClient.setQueryData<readonly GameResultGroup[]>(
    ['ongoing'],
    (prev: readonly GameResultGroup[] | undefined): readonly GameResultGroup[] | undefined => {
      if (prev === undefined) {
        return prev;
      }
      return prev.map(
        (group: GameResultGroup): GameResultGroup =>
          group.team1.country === team1 && group.team2.country === team2
            ? { ...group, liveScore }
            : group,
      );
    },
  );
};
