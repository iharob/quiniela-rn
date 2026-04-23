import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { FullScreenLogo } from '@app/components/fullScreenLogo.tsx';

export const SplashScreen: React.FC = (): React.ReactElement => {
  return (
    <View style={styles.container}>
      <SystemBars style="light" />
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="splashGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FF1F3A" />
            <Stop offset="1" stopColor="#B3000F" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#splashGradient)" />
      </Svg>
      <FullScreenLogo />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B3000F',
  },
});
