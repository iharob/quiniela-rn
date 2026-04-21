export interface TournamentTheme {
  readonly textColor: string;
  readonly contrastTextColor: string;
  readonly placeholderTextColor: string;
  readonly backgroundColor: string;
  readonly cardColor: string;
  readonly dimmedCardColor: string;
  readonly primaryColor: string;
  readonly primaryColorBright: string;
  readonly borderColor: string;
}

export interface ScoringRule {
  readonly description: string;
  readonly value: number;
}

export interface KnockoutRoundConfig {
  readonly name: string;
  readonly teamsCount: number;
  readonly matchesCount: number;
}

export interface TournamentConfig {
  readonly name: string;
  readonly apiDomain: string;
  readonly theme: TournamentTheme;
  readonly groupCount: number;
  readonly teamsPerGroup: number;
  readonly knockoutRounds: readonly KnockoutRoundConfig[];
  readonly logoUrl?: string;
  readonly scoringRules: readonly ScoringRule[];
}

export const defaultTheme: TournamentTheme = {
  textColor: '#2b2b2b',
  contrastTextColor: '#f5f5f5',
  placeholderTextColor: 'rgba(0, 0, 0, 0.35)',
  backgroundColor: '#f5f5f5',
  cardColor: '#121212',
  dimmedCardColor: '#ffffff',
  primaryColor: '#121212',
  primaryColorBright: '#222222',
  borderColor: 'rgba(0, 0, 0, 0.1)',
};

export const defaultConfig: TournamentConfig = {
  name: 'Copa Mundial 2026',
  apiDomain: 'https://api.iaales.lat',
  theme: defaultTheme,
  groupCount: 12,
  teamsPerGroup: 4,
  knockoutRounds: [
    { name: 'Dieciseisavos', teamsCount: 32, matchesCount: 16 },
    { name: 'Octavos', teamsCount: 16, matchesCount: 8 },
    { name: 'Cuartos', teamsCount: 8, matchesCount: 4 },
    { name: 'Semi-Final', teamsCount: 4, matchesCount: 2 },
    { name: 'Final', teamsCount: 2, matchesCount: 1 },
  ],
  scoringRules: [
    {
      description: 'Al acertar resultado y marcador de un juego en cualquiera de las fases',
      value: 3,
    },
    { description: 'Al acertar sólo el resultado en algun juego', value: 1 },
    { description: 'Por cada clasificado en cualquiera de la fases de grupo', value: 1 },
    { description: 'Por cada llave acertada en los grupos se le asignan', value: 2 },
    { description: 'Acertar campeón', value: 5 },
  ],
};
