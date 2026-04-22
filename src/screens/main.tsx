import { FullScreenLogo } from '@app/components/fullScreenLogo';
import { barStyleLightContent } from '@app/constants';
import { Api, useApi } from '@app/context/api';
import { SessionStore, SessionStoreContext, UserSession } from '@app/mobx/sessionStore';
import { ParticipantsScreen } from '@app/screens/ParticipantsScreen';
import { PredictScreen } from '@app/screens/PredictScreen';
import { AuthScreen } from '@app/screens/WelcomeScreen/AuthScreen';
import { useTheme } from '@app/theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { observer } from 'mobx-react';
import React from 'react';
import { StatusBar, View } from 'react-native';

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

      const session: Omit<UserSession, 'token'> | null = await api.loadSession();
      if (session !== null) {
        setTimeout((): void => {
          sessionStore.setSession({
            userId: session.userId,
            token: savedToken,
            predicted: session.predicted,
            payed: session.payed,
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
    return <FullScreenLogo />;
  }

  if (!session) {
    return (
      <SessionStoreContext.Provider value={sessionStore}>
        <StatusBar backgroundColor={theme.cardColor} barStyle={barStyleLightContent} />
        <AuthScreen />
      </SessionStoreContext.Provider>
    );
  } else if (session.predicted) {
    return (
      <SessionStoreContext.Provider value={sessionStore}>
        <StatusBar
          backgroundColor={theme.cardColor}
          barStyle={barStyleLightContent}
        />
        <View style={styles.flex}>
          <ParticipantsScreen />
        </View>
      </SessionStoreContext.Provider>
    );
  } else if (!session.predicted) {
    return (
      <SessionStoreContext.Provider value={sessionStore}>
        <StatusBar
          backgroundColor={theme.cardColor}
          barStyle={barStyleLightContent}
        />
        <View style={styles.flex}>
          <PredictScreen />
        </View>
      </SessionStoreContext.Provider>
    );
  } else {
    return <FullScreenLogo />;
  }
});

const styles = { flex: { flex: 1 } as const };
const sessionStore = new SessionStore();

