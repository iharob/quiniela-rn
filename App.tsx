import { FullScreenLogo } from '@app/components/fullScreenLogo';
import { GOOGLE_WEB_CLIENT_ID, setApiUrl } from '@app/config';
import { Api, ApiContext } from '@app/context/api';
import {
  TournamentConfigStore,
  TournamentConfigStoreContext,
} from '@app/mobx/tournamentConfigStore';
import { MainNavigator } from '@app/screens/main';
import { ThemeProvider } from '@app/theme/ThemeContext';
import {
  defaultConfig,
  TournamentConfig,
  TournamentTheme,
} from '@app/types/tournamentConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { barStyleLightContent } from '@app/constants';
import {
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import React from 'react';
import { StatusBar, StyleSheet, ViewStyle } from 'react-native';
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

  const containerStyle = React.useMemo(
    (): ViewStyle => ({
      ...styles.container,
      backgroundColor: theme.cardColor,
    }),
    [theme.cardColor],
  );

  if (!configLoaded) {
    return (
      <ThemeProvider theme={config.theme}>
        <SafeAreaView style={containerStyle}>
          <StatusBar
            backgroundColor={config.theme.cardColor}
            barStyle={barStyleLightContent}
          />
          <FullScreenLogo />
        </SafeAreaView>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={config.theme}>
      <ApiContext.Provider value={apiInstance}>
        <SafeAreaView style={containerStyle}>
          <StatusBar
            backgroundColor={theme.cardColor}
            barStyle={barStyleLightContent}
          />
          <NavigationContainer theme={applicationTheme}>
            <MainNavigator />
          </NavigationContainer>
        </SafeAreaView>
      </ApiContext.Provider>
    </ThemeProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
