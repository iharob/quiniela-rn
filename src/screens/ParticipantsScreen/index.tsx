import { SettingsModal } from '@app/components/SettingsModal';
import { HamburgerMenu } from '@app/components/hamburgerMenu';
import { ScoreDetails } from '@app/screens/ParticipantsScreen/screens/ScoreDetails';
import { TabbedView } from '@app/screens/ParticipantsScreen/screens/TabbedView';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RulesModal } from '@app/components/RulesModal.tsx';

export type StackParamsList = {
  TabbedView: undefined;
  UserScoreDetails: {
    readonly userId: number;
    readonly userName: string;
    readonly photoUrl?: string;
    readonly bio?: string;
  };
  Settings: undefined;
  Rules: undefined;
};

const Stack = createNativeStackNavigator<StackParamsList>();

export const ParticipantsScreen: React.FC = (): React.ReactElement => {
  const screenOptions = React.useMemo(
    (): NativeStackNavigationOptions => ({
      title: 'Quiniela Mundial 2026',
      headerShown: true,
      headerRight: (): React.ReactNode => <HamburgerMenu />,
      headerTintColor: 'white',
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="TabbedView" component={TabbedView} />
        <Stack.Screen name="UserScoreDetails" component={ScoreDetails} />
        <Stack.Screen name="Settings" component={SettingsModal} />
        <Stack.Screen name="Rules" component={RulesModal} />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
