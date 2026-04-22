import { logoHeight, logoWidth } from '@app/constants';
import { TournamentConfig } from '@app/types/tournamentConfig';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props {
  readonly tournamentConfig?: TournamentConfig;
}

export const FullScreenLogo: React.FC<Props> = (
  props: Props,
): React.ReactElement => {
  const { tournamentConfig } = props;

  const logoSource = React.useMemo(() => {
    if (tournamentConfig?.logoUrl) {
      return { uri: tournamentConfig.logoUrl };
    }
    return require('@app/images/logo.png');
  }, [tournamentConfig?.logoUrl]);

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logoSource} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: logoHeight,
    width: logoWidth,
  },
});
