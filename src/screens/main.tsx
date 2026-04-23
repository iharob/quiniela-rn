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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { SystemBars } from 'react-native-edge-to-edge';
import { useThemedStyles } from '@app/theme/useThemedStyles';
import { TournamentTheme } from '@app/types/tournamentConfig';

const AUTH_EDGES: readonly Edge[] = ['bottom', 'left', 'right'];

export const MainNavigator: React.FC = observer((): React.ReactElement => {
  const api = useApi();
  const { session } = sessionStore;
  const themedStyles = useThemedStyles(themedStylesFactory);

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

  if (loading) {
    return <SplashScreen />;
  }

  if (!session) {
    return (
      <SessionStoreContext.Provider value={sessionStore}>
        <SafeAreaView style={themedStyles.authContainer}>
          <SystemBars style="dark" />
          <AuthScreen />
        </SafeAreaView>
      </SessionStoreContext.Provider>
    );
  } else if (session.predicted) {
    return (
      <SessionStoreContext.Provider value={sessionStore}>
        <SystemBars style="light" />
        <SafeAreaView style={themedStyles.tabbed} edges={AUTH_EDGES}>
          <ParticipantsScreen />
        </SafeAreaView>
      </SessionStoreContext.Provider>
    );
  } else if (!session.predicted) {
    return (
      <SessionStoreContext.Provider value={sessionStore}>
        <SystemBars style="light" />
        <SafeAreaView style={themedStyles.plain} edges={AUTH_EDGES}>
          <PredictScreen />
        </SafeAreaView>
      </SessionStoreContext.Provider>
    );
  }

  return <></>;
});

const themedStylesFactory = (theme: TournamentTheme) =>
  StyleSheet.create({
    authContainer: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    tabbed: {
      flex: 1,
      backgroundColor: theme.cardColor,
    },
    plain: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
  });
const sessionStore = new SessionStore();
