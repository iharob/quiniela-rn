export interface Team {
  readonly name: string;
  readonly country: string;
}

export interface Game {
  readonly gameId: number;
  readonly team1: Team;
  readonly team2: Team;
  readonly date: string | null;
}

export interface BracketMatch {
  readonly gameId: number;
  readonly team1: Team | null;
  readonly team2: Team | null;
  readonly team1Score: number | null;
  readonly team2Score: number | null;
  readonly winner: Team | null;
  readonly date: string | null;
  readonly team1FromGame?: number;
  readonly team2FromGame?: number;
}

export interface BracketRound {
  readonly round: number;
  readonly matches: readonly BracketMatch[];
}
