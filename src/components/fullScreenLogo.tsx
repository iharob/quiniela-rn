import { logoHeight, logoWidth } from '@app/constants';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export const FullScreenLogo: React.FC = (): React.ReactElement => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('@app/images/logo-white.png')} resizeMode="contain" />
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