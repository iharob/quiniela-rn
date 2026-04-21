import { Team } from '@app/types/game';

export interface DrawMatch {
  readonly matchNum: number;
  readonly team1: Team;
  readonly team2: Team;
  readonly team1Score: number | null;
  readonly team2Score: number | null;
  readonly winner: Team | null;
}

export interface DrawResponse {
  readonly round: number;
  readonly matches: readonly DrawMatch[];
}
