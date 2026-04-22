import { SplashScreen } from '@app/components/SplashScreen.tsx';
import { Api, useApi } from '@app/context/api';
import {
  SessionStore,
  SessionStoreContext,
  UserSession,
} from '@app/mobx/sessionStore';
import { ParticipantsScreen } from '@app/screens/ParticipantsScreen';
import { PredictScreen } from '@app/screens/PredictScreen';
import { AuthScreen } from '@app/screens/WelcomeScreen/AuthScreen';
import { useTheme } from '@app/theme/ThemeContext';
import { defaultTheme } from '@app/types/tournamentConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { observer } from 'mobx-react';
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SystemBars } from 'react-native-edge-to-edge';

export const MainNavigator: React.FC = observer((): React.ReactElement => {
  const api = useApi();
  const { session } = sessionStore;
  const theme = useTheme();

  const [loading, setLoading] = React.useState<boolean>(true);

  const initialize = React.useCallback(async (): Promise<void> => {
    try {
      const savedToken = await AsyncStorage.getItem(Api.BEARER_TOKEN_KEY);
      if (savedToken !== null) {
        api.setBearerToken(savedToken);
      } else {
        return;
      }

      const loadedSession: Omit<UserSession, 'token'> | null =
        await api.loadSession();

      if (loadedSession !== null) {
        setTimeout((): void => {
          sessionStore.setSession({
            userId: loadedSession.userId,
            token: savedToken,
            predicted: loadedSession.predicted,
            payed: loadedSession.payed,
          });
        }, 0);
      } else {
        sessionStore.setSession(null);
      }
    } catch (error) {
      console.warn(error);
      sessionStore.setSession(null);
    }
  }, [api]);

  React.useLayoutEffect((): void => {
    initialize().finally((): void => {
      setTimeout((): void => {
        setLoading(false);
      }, 0);
    });
  }, [api, initialize]);

  const authContainerStyle = React.useMemo(
    (): ViewStyle => ({
      flex: 1,
      backgroundColor: defaultTheme.backgroundColor,
    }),
    [],
  );

  const authenticatedContainerStyle = React.useMemo(
    (): ViewStyle => ({
      flex: 1,
      backgroundColor: theme.cardColor,
    }),
    [theme.cardColor],
  );

  if (loading) {
    return <SplashScreen />;
  }

  if (!session) {
    return (
      <SessionStoreContext.Provider value={sessionStore}>
        <SafeAreaView style={authContainerStyle}>
          <SystemBars style="dark" />
          <AuthScreen />
        </SafeAreaView>
      </SessionStoreContext.Provider>
    );
  } else if (session.predicted) {
    return (
      <SessionStoreContext.Provider value={sessionStore}>
        <SafeAreaView style={authenticatedContainerStyle}>
          <SystemBars style="light" />
          <View style={styles.flex}>
            <ParticipantsScreen />
          </View>
        </SafeAreaView>
      </SessionStoreContext.Provider>
    );
  } else if (!session.predicted) {
    return (
      <SessionStoreContext.Provider value={sessionStore}>
        <SafeAreaView style={authenticatedContainerStyle}>
          <SystemBars style="light" />
          <View style={styles.flex}>
            <PredictScreen />
          </View>
        </SafeAreaView>
      </SessionStoreContext.Provider>
    );
  }

  return <></>;
});

const styles = { flex: { flex: 1 } as const };
const sessionStore = new SessionStore();
