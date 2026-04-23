import { Game, Team } from '@app/types/game';

export interface GameWithResult extends Game {
  readonly team1Score: number | null;
  readonly team2Score: number | null;

  readonly winner: Team | null | undefined;
}

export interface GroupWithResults {
  readonly name: string;
  readonly games: readonly GameWithResult[];
}

export interface PredictedResult {
  readonly gameDate: string;
  readonly predictedTeam1: Team;
  readonly predictedTeam2: Team;
  readonly predictedScoreTeam1: number;
  readonly predictedScoreTeam2: number;
  readonly predictedWinner: string;
  readonly actualTeam1: Team | null;
  readonly actualTeam2: Team | null;
  readonly actualScoreTeam1: number | null;
  readonly actualScoreTeam2: number | null;
  readonly actualWinner: string;
  readonly matchPoints: number;
  readonly total: number;
  readonly round: number;
  readonly classificationGroup: string;
  readonly played: boolean;
}

export interface PointsDetails {
  readonly groups: readonly PredictedResult[];
  readonly knockout: readonly PredictedResult[];
  readonly final: PredictedResult | null;
}

export class PointsDetails {
  public static empty(): PointsDetails {
    return {
      groups: [],
      knockout: [],
      final: null,
    };
  }
}
