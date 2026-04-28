/**
 * @format
 */

import { queryClient } from '@app/queryClient';
import { handleScoreMessage } from '@app/services/fcm/scoreHandler';
import type { GameResultGroup } from '@app/types/userResults';

const mexBraGroup: GameResultGroup = {
  team1: { name: 'Mexico', country: 'mx' },
  team2: { name: 'Brazil', country: 'br' },
  groupResults: [],
};
const argFraGroup: GameResultGroup = {
  team1: { name: 'Argentina', country: 'ar' },
  team2: { name: 'France', country: 'fr' },
  groupResults: [],
};

describe('handleScoreMessage', () => {
  beforeEach(() => {
    queryClient.setQueryData(['ongoing'], [mexBraGroup, argFraGroup]);
  });

  afterEach(() => {
    queryClient.removeQueries({ queryKey: ['ongoing'] });
  });

  it('overlays liveScore on the matching game and leaves others alone', () => {
    handleScoreMessage({
      data: {
        gameId: '42',
        round: '1',
        team1: 'mx',
        team2: 'br',
        team1Score: '2',
        team2Score: '1',
        status: 'IN PLAY',
      },
    });

    const next = queryClient.getQueryData<readonly GameResultGroup[]>([
      'ongoing',
    ]);
    expect(next).toBeDefined();
    expect(next![0].liveScore).toEqual({
      team1Score: 2,
      team2Score: 1,
      status: 'IN PLAY',
    });
    expect(next![1].liveScore).toBeUndefined();
  });

  it('ignores payloads missing required fields', () => {
    handleScoreMessage({
      data: { team1: 'mx', team2: 'br', team1Score: '2' },
    });
    const next = queryClient.getQueryData<readonly GameResultGroup[]>([
      'ongoing',
    ]);
    expect(next![0].liveScore).toBeUndefined();
  });

  it('ignores payloads whose scores are not numeric', () => {
    handleScoreMessage({
      data: {
        team1: 'mx',
        team2: 'br',
        team1Score: 'oops',
        team2Score: '1',
      },
    });
    const next = queryClient.getQueryData<readonly GameResultGroup[]>([
      'ongoing',
    ]);
    expect(next![0].liveScore).toBeUndefined();
  });

  it('does not modify cache when no entry exists yet', () => {
    queryClient.removeQueries({ queryKey: ['ongoing'] });
    handleScoreMessage({
      data: {
        team1: 'mx',
        team2: 'br',
        team1Score: '0',
        team2Score: '0',
        status: 'IN PLAY',
      },
    });
    expect(
      queryClient.getQueryData(['ongoing']),
    ).toBeUndefined();
  });

  it('defaults status to empty string when omitted', () => {
    handleScoreMessage({
      data: { team1: 'mx', team2: 'br', team1Score: '0', team2Score: '0' },
    });
    const next = queryClient.getQueryData<readonly GameResultGroup[]>([
      'ongoing',
    ]);
    expect(next![0].liveScore?.status).toBe('');
  });
});
