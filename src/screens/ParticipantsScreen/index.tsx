import { HamburgerMenu } from '@app/components/hamburgerMenu';
import { ScoreDetails } from '@app/screens/ParticipantsScreen/screens/ScoreDetails';
import { TabbedView } from '@app/screens/ParticipantsScreen/screens/TabbedView';
import { useTheme } from '@app/theme/ThemeContext';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';

export type StackParamsList = {
  TabbedView: undefined;
  UserScoreDetails: {
    readonly userId: number;
    readonly userName: string;
    readonly photoUrl?: string;
    readonly bio?: string;
  };
};

const Stack = createStackNavigator<StackParamsList>();

export const ParticipantsScreen: React.FC = (): React.ReactElement => {
  const screenOptions = React.useMemo(
    (): StackNavigationOptions => ({
      title: 'Quiniela Mundial 2026',
      headerShown: true,
      headerRight: HamburgerMenu,
      headerTintColor: 'white',
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="TabbedView" component={TabbedView} />
        <Stack.Screen name="UserScoreDetails" component={ScoreDetails} />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
