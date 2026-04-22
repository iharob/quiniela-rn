import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, ViewStyle } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { FullScreenLogo } from '@app/components/fullScreenLogo.tsx';
import { defaultTheme } from '@app/types/tournamentConfig';

export const SplashScreen: React.FC = (): React.ReactElement => {
  const splashContainerStyle = React.useMemo(
    (): ViewStyle => ({
      ...styles.container,
      backgroundColor: defaultTheme.backgroundColor,
    }),
    [],
  );

  return (
    <SafeAreaView style={splashContainerStyle}>
      <SystemBars style="dark" />
      <FullScreenLogo />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
