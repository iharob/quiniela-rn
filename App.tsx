import { GOOGLE_WEB_CLIENT_ID } from '@app/config';
import { Api, ApiContext } from '@app/context/api';
import { queryClient } from '@app/queryClient';
import { MainNavigator } from '@app/screens/main';
import { useFcmBootstrap } from '@app/services/fcm/useFcmBootstrap';
import { ThemeProvider } from '@app/theme/ThemeContext';
import { defaultTheme } from '@app/types/tournamentConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';

const apiInstance = new Api();

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  offlineAccess: false,
});

const applicationTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: defaultTheme.primaryColor,
    background: defaultTheme.backgroundColor,
    card: defaultTheme.cardColor,
    text: defaultTheme.textColor,
    border: defaultTheme.borderColor,
    notification: defaultTheme.primaryColorBright,
  },
  fonts: DefaultTheme.fonts,
};

const FcmBoot: React.FC = (): null => {
  useFcmBootstrap();
  return null;
};

const App: React.FC = (): React.ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={defaultTheme}>
        <ApiContext.Provider value={apiInstance}>
          <FcmBoot />
          <View style={styles.container}>
            <NavigationContainer theme={applicationTheme}>
              <MainNavigator />
            </NavigationContainer>
          </View>
        </ApiContext.Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});