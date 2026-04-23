import { GOOGLE_WEB_CLIENT_ID } from '@app/config';
import { Api, ApiContext } from '@app/context/api';
import { MainNavigator } from '@app/screens/main';
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const apiInstance = new Api();
const queryClient = new QueryClient();

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

const App: React.FC = (): React.ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={defaultTheme}>
        <ApiContext.Provider value={apiInstance}>
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