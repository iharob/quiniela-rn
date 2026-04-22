import { GOOGLE_WEB_CLIENT_ID, setApiUrl } from '@app/config';
import { Api, ApiContext } from '@app/context/api';
import { TournamentConfigStore } from '@app/mobx/tournamentConfigStore';
import { MainNavigator } from '@app/screens/main';
import { ThemeProvider } from '@app/theme/ThemeContext';
import {
  defaultConfig,
  TournamentConfig,
  TournamentTheme,
} from '@app/types/tournamentConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen } from '@app/components/SplashScreen.tsx';

const apiInstance = new Api();
const tournamentConfigStore = new TournamentConfigStore();
const queryClient = new QueryClient();

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  offlineAccess: false,
});

const App: React.FC = (): React.ReactElement => {
  const [configLoaded, setConfigLoaded] = React.useState<boolean>(false);
  const [config, setConfig] = React.useState<TournamentConfig>(defaultConfig);

  React.useEffect((): void => {
    const loadConfig = async (): Promise<void> => {
      try {
        const fetched = await apiInstance.fetchTournamentConfig();
        setApiUrl(fetched.apiDomain);

        apiInstance.setBaseUrl(`${fetched.apiDomain}/api/v1`);
        tournamentConfigStore.setConfig(fetched);

        await tournamentConfigStore.saveConfig(fetched);
        setConfig(fetched);
      } catch {
        try {
          const cached = await tournamentConfigStore.loadCached();
          if (cached) {
            setApiUrl(cached.apiDomain);
            apiInstance.setBaseUrl(`${cached.apiDomain}/api/v1`);
            tournamentConfigStore.setConfig(cached);
            setConfig(cached);
          }
        } catch (cacheError) {
          console.warn('No se pudo leer configuración en cache:', cacheError);
        }
      } finally {
        tournamentConfigStore.setLoading(false);
        setConfigLoaded(true);
      }
    };

    loadConfig().then((): void => {
      console.info('Configuration loaded');
    });
  }, []);

  const theme = React.useMemo(
    (): TournamentTheme => config.theme,
    [config.theme],
  );

  const applicationTheme = React.useMemo((): Theme => {
    return {
      ...DefaultTheme,
      dark: true,
      colors: {
        ...DefaultTheme.colors,
        primary: theme.primaryColor,
        background: theme.backgroundColor,
        card: theme.cardColor,
        text: theme.textColor,
        border: theme.borderColor,
        notification: theme.primaryColorBright,
      },
      fonts: DefaultTheme.fonts,
    };
  }, [theme]);

  if (!configLoaded) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={config.theme}>
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
