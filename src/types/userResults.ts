import { Team } from '@app/types/game';

export interface ApplicationUser {
  readonly id: number;
  readonly name: string;
  readonly photoUrl?: string;
}

export interface UserResult {
  readonly user: ApplicationUser;
  readonly team1Score: number;
  readonly team2Score: number;
}

export interface GameResultGroup {
  readonly team1: Team;
  readonly team2: Team;
  readonly results: readonly UserResult[];
}

export interface SelfResult {
  readonly self: UserResult | undefined;
}
