import { Game } from '@app/components/game';
import { Spinner } from '@app/components/spinner';
import { StyledButton } from '@app/components/styledButton';
import { SIMULATE } from '@app/config';
import { useApi } from '@app/context/api';
import { flags } from '@app/flags';
import { useGroupsScreenStore } from '@app/mobx/groupsScreenStore';
import { useKnockoutPhaseStore } from '@app/mobx/knockoutStore.ts';
import { useSessionStore } from '@app/mobx/sessionStore';
import { PredictionStackParamsList } from '@app/screens/PredictScreen';
import { GameWithResult } from '@app/screens/PredictScreen/screens/GroupsScreen/common';
import { useTheme } from '@app/theme/ThemeContext';
import { Team } from '@app/types/game';
import { getWinner } from '@app/utils';
import { simulateScore } from '@app/utils/simulate';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';

interface Props {
  readonly route: RouteProp<PredictionStackParamsList, 'Final'>;
}

export const Final: React.FC<Props> = (props: Props): React.ReactElement => {
  const { route } = props;

  const [currentGame, setCurrentGame] = React.useState<GameWithResult>(
    route.params,
  );
  const [processing, setProcessing] = React.useState<boolean>(false);
  const theme = useTheme();

  const groupsStore = useGroupsScreenStore();
  const knockoutStore = useKnockoutPhaseStore();
  const api = useApi();
  const navigation = useNavigation<NavigationProp<PredictionStackParamsList>>();
  const sessionStore = useSessionStore();

  const winner = React.useMemo(
    (): Team => getWinner(currentGame),
    [currentGame],
  );

  React.useEffect(() => {
    if (SIMULATE) {
      setCurrentGame((game: GameWithResult): GameWithResult => {
        const simulated = simulateScore(game.team1, game.team2);

        return {
          ...game,
          team1Score: simulated.team1Score,
          team2Score: simulated.team2Score,
          winner: simulated.winner,
        };
      });
    }
  }, []);

  const handleSubmit = React.useCallback((): void => {
    setProcessing(true);

    api
      .sendPrediction(groupsStore.groups, knockoutStore.rounds, currentGame)
      .then((): void => {
        sessionStore.setPredicted();
      })
      .catch(console.error)
      .finally((): void => {
        setProcessing(false);
      });
  }, [
    api,
    currentGame,
    groupsStore.groups,
    knockoutStore.rounds,
    sessionStore,
  ]);

  const handleChange = React.useCallback(
    (team: Team, value: number | null): void => {
      setCurrentGame(
        (previousValue: GameWithResult): GameWithResult =>
          team.country === previousValue.team1.country
            ? {
                ...previousValue,
                team1Score: value,
                winner: null,
              }
            : {
                ...previousValue,
                team2Score: value,
                winner: null,
              },
      );
    },
    [],
  );

  const handleWinnerSelected = React.useCallback((team: Team): void => {
    setCurrentGame(
      (previousValue: GameWithResult): GameWithResult => ({
        ...previousValue,
        winner: team,
      }),
    );
  }, []);

  React.useEffect((): void => {
    navigation.setOptions({
      headerStyle: {
        elevation: 10,
        shadowColor: theme.textColor,
      },
      headerTintColor: theme.contrastTextColor,
    });
  }, [navigation, theme.contrastTextColor, theme.textColor]);

  const WinnerFlag = React.useMemo(
    (): React.FunctionComponent<{
      readonly width: number;
      readonly height: number;
    }> => flags[winner.country],
    [winner.country],
  );

  const winnerNameStyle = React.useMemo(
    (): TextStyle => ({ ...styles.winnerName, color: theme.textColor }),
    [theme.textColor],
  );

  return (
    <View style={styles.container}>
      <Game
        game={currentGame}
        winner={winner}
        onWinnerSelected={handleWinnerSelected}
        onChange={handleChange}
      />
      <View style={styles.flexibleBox}>
        <View style={styles.flagContainer}>
          <WinnerFlag height={70} width={(4 * 70) / 3} />
        </View>
        <Text style={winnerNameStyle}>{winner.name}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <StyledButton label="Aceptar y Enviar" onPress={handleSubmit} />
      </View>
      <Spinner visible={processing} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    padding: 20,
  },
  flexibleBox: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerName: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  flagContainer: { height: 70, overflow: 'hidden' },
  flag: {
    maxWidth: (4 * 70) / 3,
    maxHeight: 70,
  },
});
