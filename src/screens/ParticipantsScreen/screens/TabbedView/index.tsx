import { useLogout } from '@app/hooks/useLogout';
import { Chat } from '@app/screens/ParticipantsScreen/screens/Chat';
import { Ongoing } from '@app/screens/ParticipantsScreen/screens/Ongoing';
import {
  ChatIcon,
  OngoingIcon,
  RankingsIcon,
  TabBarIconComponent,
} from '@app/screens/ParticipantsScreen/screens/TabbedView/tabIcon';
import { UsersList } from '@app/screens/ParticipantsScreen/screens/UsersList';
import { useTheme } from '@app/theme/ThemeContext';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React from 'react';

export const TabbedView: React.FC = (): React.ReactElement => {
  const theme = useTheme();
  useLogout('Si sale debe volver a colocar su usuario y contraseña para volver a entrar.');

  const screenOptions = React.useMemo(
    () => ({
      tabBarShowLabel: false,
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
      tabBarStyle: {
        elevation: 0,
        backgroundColor: theme.cardColor,
        borderTopWidth: 0,
      },
    }),
    [theme.cardColor],
  );
  interface TabOption {
    readonly name: string;
    readonly component: React.ComponentType;
    readonly icon: TabBarIconComponent;
  }

  const tabOptions = React.useMemo(
    (): readonly TabOption[] => [
      {
        name: 'Posiciones',
        component: UsersList,
        icon: RankingsIcon,
      },
      {
        name: 'Jugando',
        component: Ongoing,
        icon: OngoingIcon,
      },
      {
        name: 'Chat',
        component: Chat,
        icon: ChatIcon,
      },
    ],
    [],
  );

  const renderTab = React.useCallback((option: TabOption): React.ReactElement => {
    const options: BottomTabNavigationOptions = { tabBarIcon: option.icon, headerShown: false };
    return (
      <Tab.Screen
        key={option.name}
        name={option.name}
        component={option.component}
        options={options}
      />
    );
  }, []);

  return <Tab.Navigator screenOptions={screenOptions}>{tabOptions.map(renderTab)}</Tab.Navigator>;
};

const Tab = createBottomTabNavigator();
