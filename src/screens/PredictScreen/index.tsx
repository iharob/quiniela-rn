import { SettingsModal } from '@app/components/SettingsModal';
import { HamburgerMenu } from '@app/components/hamburgerMenu';
import { useApi } from '@app/context/api';
import {
  GroupsScreenStore,
  GroupsScreenStoreContext,
} from '@app/mobx/groupsScreenStore';
import {
  KnockoutStore,
  KnockoutStoreContext,
} from '@app/mobx/knockoutStore.ts';
import { useSessionStore } from '@app/mobx/sessionStore';
import { Final } from '@app/screens/PredictScreen/screens/FinalScreen';
import { Groups } from '@app/screens/PredictScreen/screens/GroupsScreen';
import { GameWithResult } from '@app/screens/PredictScreen/screens/GroupsScreen/common';
import { useTheme } from '@app/theme/ThemeContext';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import React from 'react';
import { GenericKnockout } from '@app/screens/PredictScreen/screens/GenericKnockout';

export type KnockoutParams = {
  readonly round: number;
  readonly games: ReadonlyArray<[GameWithResult, GameWithResult]>;
};

export type PredictionStackParamsList = {
  readonly Groups: undefined;
  readonly Knockout: KnockoutParams;
  readonly Final: GameWithResult;
  readonly Settings: undefined;
};

export const PredictScreen: React.FC = (): React.ReactElement => {
  const theme = useTheme();
  const api = useApi();
  const sessionStore = useSessionStore();
  const session = sessionStore.session;
  if (session === null) {
    throw new Error('PredictScreen requires an active session');
  }
  const userId = session.userId;

  const groupsScreenStore = React.useMemo(
    (): GroupsScreenStore => new GroupsScreenStore(api, userId),
    [api, userId],
  );

  const knockoutStore = React.useMemo(
    (): KnockoutStore => new KnockoutStore(api, userId),
    [api, userId],
  );

  React.useEffect((): void => {
    knockoutStore.load().catch(console.warn);
  }, [knockoutStore]);

  const screenOptions = React.useMemo(
    (): NativeStackNavigationOptions => ({
      title: '',
      headerShown: true,
      headerRight: (): React.ReactElement => <HamburgerMenu />,
      headerTintColor: theme.contrastTextColor,
    }),
    [theme.contrastTextColor],
  );

  return (
    <GroupsScreenStoreContext.Provider value={groupsScreenStore}>
      <KnockoutStoreContext.Provider value={knockoutStore}>
        <RegistrationRoutes.Navigator
          initialRouteName="Groups"
          screenOptions={screenOptions}
        >
          <RegistrationRoutes.Screen name="Groups" component={Groups} />
          <RegistrationRoutes.Screen
            name="Knockout"
            component={GenericKnockout}
          />
          <RegistrationRoutes.Screen name="Final" component={Final} />
          <RegistrationRoutes.Screen
            name="Settings"
            component={SettingsModal}
            options={{ title: 'Ajustes', headerRight: undefined }}
          />
        </RegistrationRoutes.Navigator>
      </KnockoutStoreContext.Provider>
    </GroupsScreenStoreContext.Provider>
  );
};

const RegistrationRoutes =
  createNativeStackNavigator<PredictionStackParamsList>();
