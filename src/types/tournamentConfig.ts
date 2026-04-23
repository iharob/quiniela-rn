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
