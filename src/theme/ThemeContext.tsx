import { defaultTheme, TournamentTheme } from '@app/types/tournamentConfig';
import React from 'react';

const ThemeContext = React.createContext<TournamentTheme>(defaultTheme);

interface Props {
  readonly theme: TournamentTheme;
}

export const ThemeProvider: React.FC<React.PropsWithChildren<Props>> = (
  props: React.PropsWithChildren<Props>,
): React.ReactElement => {
  const { theme, children } = props;
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): TournamentTheme => React.useContext(ThemeContext);
