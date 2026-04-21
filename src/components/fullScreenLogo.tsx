import { barStyleDarkContent } from '@app/constants';
import { useTheme } from '@app/theme/ThemeContext';
import { TournamentConfig } from '@app/types/tournamentConfig';
import React from 'react';
import { Image, StatusBar, StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
  readonly tournamentConfig?: TournamentConfig;
}

export const FullScreenLogo: React.FC<Props> = (props: Props): React.ReactElement => {
  const { tournamentConfig } = props;
  const theme = useTheme();

  const containerStyle = React.useMemo(
    (): ViewStyle => ({
      ...styles.container,
      backgroundColor: theme.backgroundColor,
    }),
    [theme.backgroundColor],
  );

  const logoSource = React.useMemo(() => {
    if (tournamentConfig?.logoUrl) {
      return { uri: tournamentConfig.logoUrl };
    }
    return require('@app/images/logo.png');
  }, [tournamentConfig?.logoUrl]);

  return (
    <>
      <View style={containerStyle}>
        <Image style={styles.logo} source={logoSource} resizeMode="contain" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: '60%',
  },
});
