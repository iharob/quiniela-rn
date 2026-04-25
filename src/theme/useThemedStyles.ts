import { useTheme } from '@app/theme/ThemeContext';
import { TournamentTheme } from '@app/types/tournamentConfig';
import React from 'react';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };
type StyleFactory<T extends NamedStyles<T>> = (theme: TournamentTheme) => T;

export const useThemedStyles = <T extends NamedStyles<T>>(factory: StyleFactory<T>): T => {
  const theme = useTheme();

  return React.useMemo(() => StyleSheet.create(factory(theme)), [factory, theme]);
};
