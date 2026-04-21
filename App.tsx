import { FullScreenLogo } from '@app/components/fullScreenLogo';
import { GOOGLE_WEB_CLIENT_ID, setApiUrl } from '@app/config';
import { Api, ApiContext } from '@app/context/api';
import {
  TournamentConfigStore,
  TournamentConfigStoreContext,
} from '@app/mobx/tournamentConfigStore';
import { MainNavigator } from '@app/screens/main';
import { ThemeProvider } from '@app/theme/ThemeContext';
import { defaultConfig, TournamentConfig } from '@app/types/tournamentConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const apiInstance = new Api();
const tournamentConfigStore = new TournamentConfigStore();

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
      } catch  {
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

    void loadConfig();
  }, []);

  const theme = React.useMemo((): Theme => {
    const t = config.theme;

    return {
      ...DefaultTheme,
      dark: true,
      colors: {
        ...DefaultTheme.colors,
        primary: t.primaryColor,
        background: t.backgroundColor,
        card: t.cardColor,
        text: t.textColor,
        border: t.borderColor,
        notification: t.primaryColorBright,
      },
      fonts: DefaultTheme.fonts,
    };
  }, [config.theme]);

  const containerStyle = React.useMemo(
    (): ViewStyle => ({
      ...styles.container,
      backgroundColor: config.theme.backgroundColor,
    }),
    [config.theme.backgroundColor],
  );

  if (!configLoaded) {
    return (
      <ThemeProvider theme={config.theme}>
        <SafeAreaView style={containerStyle}>
          <FullScreenLogo />
        </SafeAreaView>
      </ThemeProvider>
    );
  }

  return (
    <TournamentConfigStoreContext.Provider value={tournamentConfigStore}>
      <ThemeProvider theme={config.theme}>
        <ApiContext.Provider value={apiInstance}>
          <SafeAreaView style={containerStyle}>
            <NavigationContainer theme={theme}>
              <MainNavigator />
            </NavigationContainer>
          </SafeAreaView>
        </ApiContext.Provider>
      </ThemeProvider>
    </TournamentConfigStoreContext.Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
